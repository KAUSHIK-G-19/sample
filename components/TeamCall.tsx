import React, { useState, useEffect, useRef } from 'react';
import { ScheduleEvent, Course } from '../types';
import { ClockIcon, CallsIcon, MicrophoneIcon, MicrophoneMutedIcon, VideoCameraSlashIcon, SendIcon, ChatBubbleIcon, LoginIcon } from './icons/IconComponents';

interface ParticipantVideoProps {
  name: string;
  avatar: string;
  stream?: MediaStream | null;
  isMuted?: boolean;
  isLocal?: boolean;
}

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

interface TeamCallProps {
  scheduleEvents: ScheduleEvent[];
  courses: Course[];
}

const ParticipantVideo: React.FC<ParticipantVideoProps> = ({ name, avatar, stream, isMuted, isLocal }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-gray-700 rounded-lg overflow-hidden aspect-video flex items-center justify-center shadow-lg">
      {stream && stream.getVideoTracks().find(t => t.enabled) ? (
        <video ref={videoRef} autoPlay playsInline muted={isLocal} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
           <img src={avatar} alt={name} className="w-24 h-24 rounded-full" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 px-3 py-1 text-sm text-white rounded-tr-lg">
        {name}
      </div>
      {isMuted && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-1.5 rounded-full">
          <MicrophoneMutedIcon className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

const TeamCall: React.FC<TeamCallProps> = ({ scheduleEvents, courses }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callEnded, setCallEnded] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduleEvent | null>(null);
  const [isInLobby, setIsInLobby] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'Alice', text: 'Hey everyone, can you hear me?', time: '10:30 AM' },
    { sender: 'You', text: 'Loud and clear!', time: '10:31 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const courseMap = courses.reduce((acc, course) => {
    acc[course.id] = course;
    return acc;
  }, {} as Record<string, Course>);

  const today = new Date();
  const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const todaysMeetings = scheduleEvents.filter(event => event.date === todayString && event.type === 'meeting');

  useEffect(() => {
    if (selectedMeeting && !streamRef.current) {
        const startStream = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            setLocalStream(stream);
          } catch (err) {
            console.error("Error accessing media devices.", err);
            setError("Could not access camera and microphone. Please check browser permissions and reload the page.");
          }
        };
        startStream();
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setLocalStream(null);
      }
    };
  }, [selectedMeeting]);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleMute = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(prev => !prev);
  };

  const toggleCamera = () => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsCameraOff(prev => !prev);
  };

  const handleJoinMeeting = (meeting: ScheduleEvent) => {
    setSelectedMeeting(meeting);
    setIsInLobby(true);
    setCallEnded(false);
  };

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setLocalStream(null);
    }
    setCallEnded(true);
  };
  
  const returnToSchedule = () => {
      setSelectedMeeting(null);
      setCallEnded(false);
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;

    const newMessage: ChatMessage = {
      sender: 'You',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setChatInput('');

    setTimeout(() => {
      const participants = ['Alice', 'Bob', 'Charlie'];
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
      const replies = ['Got it.', 'Makes sense.', 'Thanks for sharing!', 'Okay.', 'Interesting.'];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMessage: ChatMessage = {
          sender: randomParticipant,
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1500);
  };

  const participants = [
    { name: 'Alice', avatar: 'https://picsum.photos/seed/alice/200', isMuted: true },
    { name: 'Bob', avatar: 'https://picsum.photos/seed/bob/200' },
    { name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie/200' },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-800 rounded-lg m-6 p-6 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Connection Error</h2>
        <p className="text-gray-300">{error}</p>
      </div>
    )
  }
  
  if (callEnded) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 rounded-lg m-6 p-6 text-center">
          <h2 className="text-3xl font-bold text-gray-200 mb-4">Call Ended</h2>
          <p className="text-gray-400">You have left the meeting: "{selectedMeeting?.title}".</p>
          <button onClick={returnToSchedule} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Back to Schedule
          </button>
        </div>
      )
  }
  
  if (!selectedMeeting) {
      return (
          <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Today's Meetings</h2>
              {todaysMeetings.length > 0 ? (
                  <div className="space-y-4">
                      {todaysMeetings.map(event => {
                          const course = courseMap[event.courseId];
                          return (
                              <div key={event.id} className={`flex items-center justify-between bg-gray-800 p-4 rounded-lg border-l-4 border-${course?.color || 'gray'}-500`}>
                                  <div>
                                      <p className="font-bold text-lg text-white">{event.title}</p>
                                      <p className="text-sm text-gray-400">{course?.title}</p>
                                  </div>
                                  <div className="flex items-center space-x-6">
                                    <div className="flex items-center text-gray-300">
                                        <ClockIcon className="w-5 h-5 mr-2" />
                                        <span>{event.time}</span>
                                    </div>
                                    <button onClick={() => handleJoinMeeting(event)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                        Join Now
                                    </button>
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              ) : (
                  <div className="text-center text-gray-400 bg-gray-800 p-8 rounded-lg">
                      <p>No meetings scheduled for today.</p>
                  </div>
              )}
          </div>
      )
  }
  
  if (isInLobby) {
    return (
        <div className="flex flex-col items-center justify-center h-full m-6 rounded-lg bg-gray-800">
            <h2 className="text-3xl font-bold text-gray-100 mb-2">Ready to join?</h2>
            <p className="text-lg text-gray-400 mb-4">{selectedMeeting.title}</p>
            <div className="w-full max-w-lg aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl mb-6">
                {localStream ? (
                    <video ref={(el) => { if (el) el.srcObject = localStream; }} autoPlay playsInline muted className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : 'block'}`} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
                    </div>
                )}
                {isCameraOff && <div className="w-full h-full flex items-center justify-center text-gray-400">Camera is off</div>}
            </div>
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={toggleMute} className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    {isMuted ? <MicrophoneMutedIcon className="w-6 h-6 text-white" /> : <MicrophoneIcon className="w-6 h-6 text-white" />}
                </button>
                <button onClick={toggleCamera} className={`p-3 rounded-full transition-colors ${isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    {isCameraOff ? <VideoCameraSlashIcon className="w-6 h-6 text-white" /> : <CallsIcon className="w-6 h-6 text-white" />}
                </button>
            </div>
            <button onClick={() => setIsInLobby(false)} className="flex items-center text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                <LoginIcon className="w-6 h-6 mr-2" />
                Join Meeting Now
            </button>
            <button onClick={returnToSchedule} className="mt-4 text-sm text-gray-400 hover:text-white">
                Back to schedule
            </button>
        </div>
    )
  }

  return (
    <div className="flex h-full m-6 rounded-lg overflow-hidden">
      <div className="flex flex-col flex-grow bg-gray-800">
        <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ParticipantVideo name="You" avatar="https://picsum.photos/seed/you/200" stream={localStream} isLocal={true} isMuted={isMuted} />
          {participants.map(p => <ParticipantVideo key={p.name} {...p} />)}
        </div>
        <div className="bg-gray-900 p-4 flex justify-center items-center space-x-4">
          <button onClick={toggleMute} className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {isMuted ? <MicrophoneMutedIcon className="w-6 h-6 text-white" /> : <MicrophoneIcon className="w-6 h-6 text-white" />}
          </button>
          <button onClick={toggleCamera} className={`p-3 rounded-full transition-colors ${isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {isCameraOff ? <VideoCameraSlashIcon className="w-6 h-6 text-white" /> : <CallsIcon className="w-6 h-6 text-white" />}
          </button>
          <button onClick={() => setIsChatVisible(!isChatVisible)} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            <ChatBubbleIcon className="w-6 h-6 text-white" />
          </button>
          <button onClick={endCall} className="px-6 py-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors text-white font-semibold">
            End Call
          </button>
        </div>
      </div>
      {isChatVisible && (
        <div className="w-full max-w-sm flex flex-col bg-gray-900 border-l border-gray-700">
            <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <h3 className="text-xl font-bold text-white">Live Chat</h3>
            </div>
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-lg px-3 py-2 max-w-[90%] ${msg.sender === 'You' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                            <p className="text-sm font-bold text-gray-300">{msg.sender}</p>
                            <p className="text-white text-sm break-words">{msg.text}</p>
                            <p className="text-xs text-gray-400 text-right mt-1">{msg.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-700 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input 
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow bg-gray-700 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Chat message input"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full text-white transition-colors flex-shrink-0" aria-label="Send message">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default TeamCall;