import React from 'react';

const MessageTile = ({ message, userId }) => {
  const isSentByMe = message.from === userId;

  return (
    <div
      style={{
        ...styles.messageContainer,
        ...(isSentByMe ? styles.myMessage : styles.otherMessage),
      }}
    >
      <div style={styles.messageHeader}>
        <span style={styles.fromText}>
          {isSentByMe ? 'You:' : `~${message.from}`}
        </span>
      </div>

      <p style={styles.messageText}>{message.message}</p>

    </div>
  );
};

const styles = {
  messageContainer: {
    marginBottom: '10px',
    maxWidth: '80%',
    borderRadius: '10px',
    padding: '10px',
    minWidth: '100px',
  },
  myMessage: {
    backgroundColor: '#0096c7',
    alignSelf: 'flex-end',
    color: '#FFF',
  },
  otherMessage: {
    backgroundColor: '#ff8fab',
    alignSelf: 'flex-start',
    color: '#FFF',
  },
  messageText: {
    fontSize: '16px',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  fromText: {
    fontWeight: 'bold',
  },
  deleteIcon: {
    color: 'white',
    cursor: 'pointer',
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  statusIcon: {
    fontSize: '12px',
    color: '#FFF',
  },
  fileLink: {
    color: '#FFF',
    textDecoration: 'underline',
  },
};

export default MessageTile;
