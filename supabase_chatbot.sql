-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Table for Chat Sessions (One conversation = One Session)
create table chat_sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text default 'Nouvelle conversation', -- Summary of topic
  user_ip text, -- Optional: to detect abuse
  status text default 'active' -- active, closed, archived
);

-- 2. Table for Messages (History of the conversation)
create table chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Security (Row Level Security)
-- We ENABLE RLS to prevent public access.
-- Only the "Service Role" (your Next.js Server) can read/write data.
-- Public users (anon) cannot access these tables directly.

alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- Policies: Allow NOTHING for public (anon). 
-- This ensures strict security. Only your API /api/chat route can touch this data.
create policy "No public access to sessions" on chat_sessions for all using (false);
create policy "No public access to messages" on chat_messages for all using (false);
