import { useState } from 'react'
import { Search, Send, Paperclip, X, Filter } from 'lucide-react'
import { mockMessages } from '../adminData'

export default function Messages() {
  const [activeConv, setActiveConv] = useState(mockMessages[0])
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState(mockMessages)
  const [search, setSearch] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [bulkMsg, setBulkMsg] = useState('')

  const sendMsg = () => {
    if (!input.trim()) return
    const updated = msgs.map(c =>
      c.id === activeConv.id
        ? { ...c, messages: [...c.messages, { id: c.messages.length+1, from:'admin', text:input, time:new Date().toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'}) }], unread:0 }
        : c
    )
    setMsgs(updated)
    const curr = updated.find(c=>c.id===activeConv.id)!
    setActiveConv(curr)
    setInput('')
  }

  const filtered = msgs.filter(c => !search || c.client.includes(search) || c.preview.includes(search))
  const totalUnread = msgs.reduce((s,c)=>s+c.unread,0)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>نظام المراسلات</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>{msgs.length} محادثة — {totalUnread} غير مقروء</p>
        </div>
        <button onClick={()=>setShowBulk(!showBulk)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background: showBulk ? 'rgba(14,165,233,0.15)' : 'transparent',border:`1px solid ${showBulk ? 'rgba(14,165,233,0.3)' : '#E2E8F0'}`,borderRadius:8,color: showBulk ? '#0EA5E9' : '#64748B',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
          📢 رسالة جماعية
        </button>
      </div>

      {/* Bulk Message */}
      {showBulk && (
        <div style={{background:'rgba(14,165,233,0.06)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:12,padding:16}}>
          <div style={{fontSize:'0.82rem',fontWeight:700,color:'#0EA5E9',marginBottom:10}}>📢 إرسال رسالة جماعية لكل العملاء</div>
          <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
            <textarea value={bulkMsg} onChange={e=>setBulkMsg(e.target.value)} placeholder="اكتب رسالتك هنا..." rows={2}
              style={{flex:1,padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",resize:'none',outline:'none'}}/>
            <button style={{padding:'10px 20px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem',whiteSpace:'nowrap'}}>إرسال للكل</button>
          </div>
        </div>
      )}

      {/* Chat Layout */}
      <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:0,background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden',height:560}}>
        {/* Conversation List */}
        <div style={{borderLeft:'1px solid #E2E8F0',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'12px 14px',borderBottom:'1px solid #E2E8F0'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,padding:'7px 10px'}}>
              <Search size={13} color="#64748B"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{background:'none',border:'none',outline:'none',color:'#1E293B',fontSize:'0.75rem',fontFamily:"'Cairo',sans-serif",flex:1,minWidth:0}}/>
            </div>
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {filtered.map(c => (
              <div key={c.id} onClick={()=>setActiveConv(c)}
                style={{padding:'12px 14px',borderBottom:'1px solid rgba(203,213,225,0.6)',cursor:'pointer',background: activeConv.id===c.id ? 'rgba(14,165,233,0.08)' : 'transparent',borderRight: activeConv.id===c.id ? '2px solid #C9A84C' : '2px solid transparent',transition:'all 0.15s'}}
                onMouseEnter={e=>{if(activeConv.id!==c.id)e.currentTarget.style.background='rgba(14,165,233,0.03)'}}
                onMouseLeave={e=>{if(activeConv.id!==c.id)e.currentTarget.style.background='transparent'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{position:'relative',flexShrink:0}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#E2E8F0,#0A1628)',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',fontWeight:700,color:'#0EA5E9'}}>
                      {c.client.charAt(0)}
                    </div>
                    {c.online && <div style={{position:'absolute',bottom:0,right:0,width:8,height:8,borderRadius:'50%',background:'#00D97E',border:'2px solid #0C1A2E'}}/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:'0.78rem',fontWeight:600,color:'#1E293B'}}>{c.client}</span>
                      <span style={{fontSize:'0.62rem',color:'#94A3B8',flexShrink:0}}>{c.time}</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:2}}>
                      <span style={{fontSize:'0.7rem',color:'#64748B',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{c.preview}</span>
                      {c.unread > 0 && <span style={{background:'#FF4560',color:'white',borderRadius:10,padding:'1px 6px',fontSize:'0.6rem',fontWeight:700,flexShrink:0,marginRight:4}}>{c.unread}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{display:'flex',flexDirection:'column'}}>
          {/* Header */}
          <div style={{padding:'12px 16px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{position:'relative'}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',fontWeight:700,color:'#FFFFFF'}}>{activeConv.client.charAt(0)}</div>
                {activeConv.online && <div style={{position:'absolute',bottom:0,right:0,width:8,height:8,borderRadius:'50%',background:'#00D97E',border:'2px solid #0C1A2E'}}/>}
              </div>
              <div>
                <div style={{fontSize:'0.85rem',fontWeight:700,color:'#1E293B'}}>{activeConv.client}</div>
                <div style={{fontSize:'0.65rem',color: activeConv.online ? '#00D97E' : '#64748B'}}>{activeConv.online ? '● متصل الآن' : 'غير متصل'}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:6}}>
              <button style={{padding:'5px 10px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:7,color:'#3B82F6',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>📊 محفظته</button>
              <button style={{padding:'5px 10px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:7,color:'#0EA5E9',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>👤 ملفه</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:12}}>
            {activeConv.messages.map(m => (
              <div key={m.id} style={{display:'flex',justifyContent: m.from==='admin' ? 'flex-start' : 'flex-end'}}>
                <div style={{maxWidth:'70%',padding:'10px 14px',borderRadius: m.from==='admin' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',background: m.from==='admin' ? 'linear-gradient(135deg,#0EA5E9,#38BDF8)' : '#FFFFFF',color: m.from==='admin' ? '#F1F5F9' : '#1E293B',fontSize:'0.82rem',lineHeight:1.5}}>
                  {m.text}
                  <div style={{fontSize:'0.6rem',color: m.from==='admin' ? 'rgba(6,14,26,0.6)' : "#94A3B8"',marginTop:4,textAlign:'left'}}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{padding:'12px 16px',borderTop:'1px solid #E2E8F0',display:'flex',gap:8,alignItems:'flex-end'}}>
            <button style={{width:34,height:34,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#64748B',flexShrink:0}}>
              <Paperclip size={14}/>
            </button>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg()}}} placeholder="اكتب رسالتك..."
              style={{flex:1,padding:'9px 14px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}
              onFocus={e=>e.target.style.borderColor='#0EA5E9'}
              onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
            <button onClick={sendMsg} style={{width:34,height:34,background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
              <Send size={14} color="#060E1A"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
