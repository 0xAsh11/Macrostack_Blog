import React, { useState, useEffect } from 'react';
import { FiList, FiPlus, FiUser } from 'react-icons/fi';

// Sample ticket data
const initialTickets = [
  { id: 1, subject: 'Wi-Fi not working', status: 'Open', message: 'My Wi-Fi has been down since morning.' },
  { id: 2, subject: 'Water leakage', status: 'In Progress', message: 'There is a water leak in the lobby bathroom.' },
  { id: 3, subject: 'Electricity fluctuation', status: 'Resolved', message: 'Power kept going on/off last night.' },
];

export default function CustomerCarePortal() {
  const [view, setView] = useState('list'); // 'list' | 'detail' | 'new'
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    // Load ElevenLabs Convai widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSelect = (ticket) => {
    setSelectedTicket(ticket);
    setView('detail');
  };

  const handleBack = () => {
    setView('list');
    setSelectedTicket(null);
  };

  const handleAdd = (ticket) => {
    setTickets([{ ...ticket, id: tickets.length + 1, status: 'Open' }, ...tickets]);
    setView('list');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="p-4 bg-blue-600 text-white text-xl font-semibold">
        Customer Care
      </header>

      <main className="flex-1 overflow-auto p-4 space-y-4">
        {/* ElevenLabs Convai Widget */}
        <elevenlabs-convai agent-id="agent_01jzmfbra3ed7rke5p8gc2sh3g"></elevenlabs-convai>

        {view === 'list' && <TicketList tickets={tickets} onSelect={handleSelect} />}
        {view === 'detail' && selectedTicket && (<TicketDetail ticket={selectedTicket} onBack={handleBack} />)}
        {view === 'new' && <NewTicket onBack={handleBack} onSubmit={handleAdd} />}
      </main>

      <nav className="h-16 flex justify-around items-center bg-white border-t">
        <button onClick={() => setView('list')} className="flex flex-col items-center text-gray-600">
          <FiList size={24} />
          <span className="text-xs">Tickets</span>
        </button>
        <button onClick={() => setView('new')} className="flex flex-col items-center text-gray-600">
          <FiPlus size={24} />
          <span className="text-xs">New</span>
        </button>
        <button onClick={() => alert('Profile coming soon')} className="flex flex-col items-center text-gray-600">
          <FiUser size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
}

function TicketList({ tickets, onSelect }) {
  return (
    <ul>
      {tickets.map(ticket => (
        <li key={ticket.id} className="p-4 mb-2 bg-white rounded shadow" onClick={() => onSelect(ticket)}>
          <div className="flex justify-between">
            <span className="font-medium">{ticket.subject}</span>
            <span className="text-sm text-gray-500">{ticket.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function TicketDetail({ ticket, onBack }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <button onClick={onBack} className="mb-4 text-blue-600">&larr; Back</button>
      <h2 className="text-xl font-semibold mb-2">{ticket.subject}</h2>
      <p className="text-sm text-gray-500 mb-4">Status: {ticket.status}</p>
      <p>{ticket.message}</p>
    </div>
  );
}

function NewTicket({ onBack, onSubmit }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    onSubmit({ subject, message });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button onClick={onBack} className="text-blue-600">&larr; Cancel</button>
      <div>
        <label className="block text-sm font-medium mb-1">Subject</label>
        <input
          className="w-full p-2 border rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief subject"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          className="w-full p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue"
          rows={4}
        />
      </div>
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
        Submit Ticket
      </button>
    </form>
  );
}
