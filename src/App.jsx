import React from 'react';
import WordBuddyApp from './phase1/WordBuddyApp';

class AppBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div style={{ maxWidth: 420, margin: '15vh auto', padding: 24, textAlign: 'center', fontFamily: 'sans-serif' }}><h1>稍等，小伙伴迷路了</h1><p>刷新一下试试，已经保存的练习还在。</p><button onClick={() => window.location.reload()}>重新打开</button></div>;
    return this.props.children;
  }
}

export default function App() {
  return <AppBoundary><WordBuddyApp/></AppBoundary>;
}
