/* ✅ NUOVO: Stili per la sezione Chat */

.chat-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 24px;
}

.chat-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-bubble {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-user {
  align-self: flex-start;
}

.message-admin {
  align-self: flex-end;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  gap: 12px;
}

.message-sender {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-user .message-text {
  background: #f3f4f6;
  color: #1f2937;
  border-bottom-left-radius: 4px;
}

.message-admin .message-text {
  background: #3b82f6;
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

/* Spinner per il loading */
.spinner {
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Scrollbar personalizzata per la chat */
.chat-container::-webkit-scrollbar {
  width: 8px;
}

.chat-container::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
  }
  
  .chat-input-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .chat-input-container button {
    align-self: stretch !important;
    margin-left: 0 !important;
    margin-top: 8px;
  }
}
