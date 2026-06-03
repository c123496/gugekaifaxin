'use client';
import { useState } from 'react';

export function Gate({ error, onSubmit }: { error?: boolean; onSubmit: (key: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <div className="gate">
      <form
        className="gate__card"
        onSubmit={(e) => { e.preventDefault(); if (val.trim()) onSubmit(val.trim()); }}
      >
        <div className="gate__mark">✉</div>
        <h1 className="gate__title">外贸开发信工具</h1>
        <p className="gate__sub">请输入访问密码</p>
        {error && <div className="gate__err">密码错误，请重新输入</div>}
        <input
          className="gate__input"
          type="password"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="访问密码"
          autoFocus
        />
        <button className="btn btn--hivis gate__btn" type="submit">进入</button>
      </form>
    </div>
  );
}
