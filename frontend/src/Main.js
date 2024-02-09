import React, { useState } from 'react';
import "./Main.css";
import axios from 'axios';

function Main() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${window.location.origin}/url`, {
        url: longUrl,
      });
      setShortUrl(response.data.id);
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${shortUrl}`);
      setCopySuccess(true);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="main" data-theme="light">
      <h1 className="title">URL Shortener</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter a long URL..."
        />
        <button type="submit">Shorten</button>
      </form>

      {shortUrl && (
        <div className="short-url-container">
          <a
            href={`${window.location.origin}/${shortUrl}`}
            className="short-url"
            target="_blank"
            rel="noopener noreferrer"
          >
            `${window.location.origin}/${shortUrl}`
          </a>
          <button onClick={copyToClipboard}>Copy URL</button>
          {copySuccess && <p>URL copied to clipboard!</p>}
        </div>
      )}
    </div>
  );
}

export default Main;
