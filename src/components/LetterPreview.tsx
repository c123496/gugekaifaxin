'use client';
import { useState } from 'react';

export function LetterPreview({
  subject, body, onClose,
}: {
  subject: string;
  body: string;
  onClose?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="panel letter">
      <div className="letter__head">
        <h3>开发信预览</h3>
        <div className="letter__head-actions">
          <button className="letter__btn letter__btn--hivis" onClick={copyAll}>
            {copied ? '✓ 已复制' : '复制全文'}
          </button>
          {onClose && <button className="letter__btn" onClick={onClose}>关闭</button>}
        </div>
      </div>
      <div className="letter__body">
        <div className="letter__subject">
          <span>Subject</span>
          {subject}
        </div>
        <pre className="letter__text">{body}</pre>
      </div>
    </div>
  );
}
