import { useState, useEffect } from 'react'
import { Plus, X, Shield, Loader2, RefreshCw } from 'lucide-react'
import { createSubAdmin, getSubAdmins, type SubAdmin } from '../../../lib/api'

const roleBadge: Record<string,{bg:string;color:string}> = {
  'SUPER_ADMIN':{bg:'rgba(14,165,233,0.15)',color:'#0EA5E9'},
  'super':{bg:'rgba(14,165,233,0.15)',color:'#0EA5E9'},
  'ADMIN':{bg:'rgba(59,130,246,0.1)',color:'#3B82F6'},
  'admin':{bg:'rgba(59,130,246,0.1)',color:'#3B82F6'},
  'ADVISOR':{bg:'rgba(245,158,11,0.1)',color:'#F59E0B'},
  'advisor':{bg:'rgba(245,158,11,0.1)',color:'#F59E0B'},
  'CONTENT_MANAGER':{bg:'rgba(0,217,126,0.1)',color:'#00D97E'},
  'content_manager':{bg:'rgba(0,217,126,0.1)',color:'#00D97E'},
  'sub':{bg:'rgba(148,163,189,0.15)',color:'#64748B'},
}

const roleLabels: Record<string,string> = {
  'SUPER_ADMIN':'Super Admin',
  'super':'Super Admin',
  'ADMIN':'مشرف',
  'admin':'مشرف',
  'ADVISOR':'مستشار',
  'advisor':'مستشار',
  'CONTENT_MANAGER':'محرر محتوى',
  'content_manager':'محرر محتوى',
  'sub':'مشرف فرعي',
}

const permissions: Record<string,string[]> = {
  'SUPER_ADMIN':['كل الصلاحيات','إدارة الفريق','إعدادات النظام','التقارير المالية','حذف البيانات'],
  'super':['كل الصلاحيات','إدارة الفريق','إعدادات النظام','التقارير المالية','حذف البيانات'],
  'ADMIN':['إدارة العملاء','الصفقات','المحتوى','التقارير','الرسائل'],
  'admin':['إدارة العملاء','الصفقات','المحتوى','التقارير','الرسائل'],
  'ADVISOR':['عرض العملاء','إضافة صفقات','الرسائل','التقارير الخاصة'],
  'advisor':['عرض العملاء','إضافة صفقات','الرسائل','التقارير الخاصة'],
  'CONTENT_MANAGER':['إدارة المقالات','نشر المحتوى','إدارة الأخبار'],
  'content_manager':['إدارة المقالات','نشر المحتوى','إدارة الأخبار'],
  'sub':['إدارة العملاء','المحافظ','المعاملات'],
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: string
  permissions?: string[]
  created_at?: string
}

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [viewMember, setViewMember] = useState<TeamMember|null>(null)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('ADVISOR')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getSubAdmins()
      setTeam(data.subAdmins || [])
    } catch (e) {
      setError('فشل تحميل بيانات الفريق')
    }
    setLoading(false)
  }

  const stats = [
    {label:'Super Admin',count:team.filter(t=>t.role==='super' || t.role==='SUPER_ADMIN').length,icon:'👑',color:'#0EA5E9'},
    {label:'مشرفون',count:team.filter(t=>t.role==='admin' || t.role==='ADMIN' || t.role==='sub').length,icon:'🔵',color:'#3B82F6'},
    {label:'مستشارون',count:team.filter(t=>t.role==='advisor' || t.role==='ADVISOR').length,icon:'🟡',color:'#F59E0B'},
    {label:'المحررون',count:team.filter(t=>t.role==='content_manager' || t.role==='CONTENT_MANAGER').length,icon:'🟢',color:'#00D97E'},
  ]

  const handleAddMember = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setFormError('جميع الحقول مطلوبة')
      return
    }
    if (newPassword.length < 6) {
      setFormError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    setFormError('')
    setSaving(true)
    try {
      await createSubAdmin({ name: newName.trim(), email: newEmail.trim(), password: newPassword })
      setSuccess('تم إضافة العضو بنجاح')
      setNewName(''); setNewEmail(''); setNewPassword(''); setNewRole('ADVISOR')
      await loadTeam()
      setTimeout(() => { setSuccess(''); setShowModal(false) }, 1500)
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'حدث خطأ')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:400,gap:16}}>
        <Loader2 className="size-8 animate-spin" style={{color:'#0EA5E9'}}/>
        <div style={{fontSize:'0.85rem',color:'#64748B'}}>جارٍ تحميل بيانات الفريق...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:400,gap:16}}>
        <div style={{fontSize:'2.5rem'}}>⚠️</div>
        <div style={{fontSize:'0.95rem',color:'#64748B'}}>{error}</div>
        <button onClick={loadTeam} style={{padding:'10px 20px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#fff',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>إعادة المحاولة</button>
      </div>
    )
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>إدارة الفريق</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>{team.length} عضو — {team.filter(t=>t.status==='active').length} نشط</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={loadTeam} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 14px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',fontWeight:600,fontSize:'0.8rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <RefreshCw size={14}/> تحديث
          </button>
          <button onClick={()=>setShowModal(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Plus size={14}/> إضافة عضو
          </button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {stats.map((s,i)=>(
          <div key={i} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'1.6rem'}}>{s.icon}</span>
            <div>
              <div style={{fontSize:'0.68rem',color:'#64748B',fontWeight:600}}>{s.label}</div>
              <div style={{fontSize:'1.6rem',fontWeight:800,color:s.color,fontFamily:'monospace'}}>{s.count}</div>
            </div>
          </div>
        ))}
      </div>

      {team.length === 0 ? (
        <div style={{textAlign:'center',padding:60,background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14}}>
          <div style={{fontSize:'2.5rem',marginBottom:12}}>👥</div>
          <div style={{fontSize:'0.95rem',fontWeight:700,color:'#1E293B',marginBottom:6}}>لا يوجد أعضاء في الفريق</div>
          <div style={{fontSize:'0.82rem',color:'#64748B',marginBottom:16}}>قم بإضافة أول عضو للفريق</div>
          <button onClick={()=>setShowModal(true)} style={{padding:'10px 24px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#fff',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>+ إضافة عضو جديد</button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {team.map(member=>(
            <div key={member.id} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:20,display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:`linear-gradient(135deg,${roleBadge[member.role]?.color||'#64748B'},${roleBadge[member.role]?.color||'#64748B'}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:800,color:'#FFFFFF',flexShrink:0}}>
                  {member.name.charAt(0)}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'0.85rem',fontWeight:700,color:'#1E293B'}}>{member.name}</div>
                  <span style={{...roleBadge[member.role],borderRadius:20,padding:'2px 10px',fontSize:'0.65rem',fontWeight:700}}>{roleLabels[member.role]||member.role}</span>
                </div>
                <div style={{width:8,height:8,borderRadius:'50%',background: member.status==='active' ? '#00D97E' : '#64748B',flexShrink:0}}/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem'}}>
                  <span style={{color:'#64748B'}}>البريد</span>
                  <span style={{color:'#1E293B'}}>{member.email}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem'}}>
                  <span style={{color:'#64748B'}}>تاريخ الإنضمام</span>
                  <span style={{color:'#1E293B'}}>{member.created_at ? new Date(member.created_at).toLocaleDateString('ar-SA') : '-'}</span>
                </div>
              </div>
              <div style={{borderTop:'1px solid #E2E8F0',paddingTop:12}}>
                <div style={{fontSize:'0.65rem',color:'#64748B',fontWeight:600,marginBottom:6}}>الصلاحيات</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {(permissions[member.role]||member.permissions||[]).slice(0,3).map(p=>(
                    <span key={p} style={{fontSize:'0.6rem',color:'#1E293B',background:'rgba(203,213,225,0.8)',borderRadius:4,padding:'2px 6px'}}>{p}</span>
                  ))}
                  {(permissions[member.role]||(member.permissions||[])).length > 3 && <span style={{fontSize:'0.6rem',color:'#64748B',padding:'2px 4px'}}>+{(permissions[member.role]||(member.permissions||[])).length-3}</span>}
                </div>
              </div>
              <div style={{display:'flex',gap:6}}>
                <button onClick={()=>setViewMember(member)} style={{flex:1,padding:'7px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:7,color:'#3B82F6',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>عرض</button>
                {member.role !== 'super' && member.role !== 'SUPER_ADMIN' && (
                  <button style={{flex:1,padding:'7px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:7,color:'#FF4560',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>تعطيل</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:8}}>
          <Shield size={16} color="#C9A84C"/>
          <span style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B'}}>مصفوفة الصلاحيات</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
            <thead>
              <tr>
                <th style={{padding:'10px 16px',textAlign:'right',fontSize:'0.7rem',color:'#64748B',borderBottom:'1px solid #E2E8F0',background:'#F1F5F9',fontWeight:600}}>الصلاحية</th>
                {['Super Admin','Admin','Advisor','Content Manager'].map(r=>(
                  <th key={r} style={{padding:'10px 16px',textAlign:'center',fontSize:'0.7rem',color:'#64748B',borderBottom:'1px solid #E2E8F0',background:'#F1F5F9',fontWeight:600,whiteSpace:'nowrap'}}>{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['إدارة العملاء','✅','✅','👁️','✖️'],['الصفقات','✅','✅','✅','✖️'],['التقارير المالية','✅','✅','✖️','✖️'],['إدارة المحتوى','✅','✅','✖️','✅'],['إعدادات النظام','✅','✖️','✖️','✖️'],['إدارة الفريق','✅','✖️','✖️','✖️']].map((row,i)=>(
                <tr key={i} onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.03)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'10px 16px',fontSize:'0.78rem',color:'#1E293B',borderBottom:'1px solid rgba(203,213,225,0.6)',fontWeight:600}}>{row[0]}</td>
                  {row.slice(1).map((v,j)=>(
                    <td key={j} style={{padding:'10px 16px',textAlign:'center',fontSize:'0.9rem',borderBottom:'1px solid rgba(203,213,225,0.6)'}}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(100,116,139,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setShowModal(false)}>
          <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:16,width:480}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,color:'#1E293B'}}>إضافة عضو جديد</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#64748B',display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:14}}>
              {[{label:'الاسم الكامل',value:newName,set:setNewName,placeholder:'أحمد محمد',type:'text'},{label:'البريد الإلكتروني',value:newEmail,set:setNewEmail,placeholder:'ahmed@company.com',type:'email'},{label:'كلمة المرور',value:newPassword,set:setNewPassword,placeholder:'6 أحرف على الأقل',type:'password'}].map(f=>(
                <div key={f.label}>
                  <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:6}}>{f.label}</div>
                  <input type={f.type} value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} style={{width:'100%',padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}} onFocus={e=>e.target.style.borderColor='#0EA5E9'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                </div>
              ))}
              <div>
                <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:6}}>الدور</div>
                <select value={newRole} onChange={e=>setNewRole(e.target.value)} style={{width:'100%',padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}>
                  {Object.entries(roleLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              {formError && <div style={{fontSize:'0.78rem',color:'#FF4560',background:'rgba(255,69,96,0.06)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:7,padding:'9px 12px'}}>{formError}</div>}
              {success && <div style={{fontSize:'0.78rem',color:'#00D97E',background:'rgba(0,217,126,0.06)',border:'1px solid rgba(0,217,126,0.2)',borderRadius:7,padding:'9px 12px'}}>{success}</div>}
              <button onClick={handleAddMember} disabled={saving} style={{width:'100%',padding:'11px',background: saving ? '#94A3B8' : 'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:800,cursor: saving ? 'not-allowed' : 'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                {saving ? 'جاري الإضافة...' : 'إضافة العضو'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMember && (
        <div style={{position:'fixed',inset:0,background:'rgba(100,116,139,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setViewMember(null)}>
          <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:16,width:400,padding:24}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <span style={{fontWeight:700,color:'#1E293B'}}>تفاصيل العضو</span>
              <button onClick={()=>setViewMember(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#64748B',display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10,fontSize:'0.82rem'}}>
              {[['الاسم',viewMember.name],['البريد',viewMember.email],['الدور',roleLabels[viewMember.role]||viewMember.role],['الحالة',viewMember.status==='active'?'نشط':'موقوف'],['تاريخ الانضمام',viewMember.created_at?new Date(viewMember.created_at).toLocaleDateString('ar-SA'):'-']].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(203,213,225,0.5)'}}>
                  <span style={{color:'#64748B'}}>{k}</span>
                  <span style={{color:'#1E293B',fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
