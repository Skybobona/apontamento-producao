'use client'
import { useState, useMemo, useEffect, useCallback, memo, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════
// SUPABASE CLIENT
// ═══════════════════════════════════════════════
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// ═══════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════
const AL_DENSITY = 2.70
const MEAL_H = 1
const OPS = ['desbaste', 'corte', 'laminar', 'expedicao']
const OP_L = { desbaste: 'DESBASTE', corte: 'CORTE', laminar: 'LAMINAR', expedicao: 'EXPEDIÇÃO' }
const TABS = [
  { k: 'pedido', l: 'Pedido' }, { k: 'desbaste', l: 'Desbaste' },
  { k: 'corte', l: 'Corte' }, { k: 'laminar', l: 'Laminar' },
  { k: 'expedicao', l: 'Expedição' }, { k: 'palete', l: 'Palete' },
  { k: 'obs', l: 'Obs' }, { k: 'historico', l: 'Histórico' },
  { k: 'comparar', l: 'Comparar' }, { k: 'ranking', l: 'Ranking' },
  { k: 'cadastro', l: 'Chapas' }
]

const THEMES = {
  'warm-dark': { name: 'Warm Dark', group: 'dark', bg: '#131210', sf: '#1a1917', sf2: '#21201d', sf3: '#2a2926', bd: '#353430', bd2: '#484742', bd3: '#5c5b55', tx: '#e8e6e1', tx2: '#b5b3ac', tx3: '#8a8880', tx4: '#6b6960', accent: '#8b9dc3', accent2: '#6b82ad', accentBg: 'rgba(139,157,195,.07)', accentBorder: 'rgba(139,157,195,.18)', green: '#6ea882', greenBg: 'rgba(110,168,130,.07)', rose: '#c27070', roseBg: 'rgba(194,112,112,.07)', violet: '#9a8abf', violetBg: 'rgba(154,138,191,.07)', gold: '#c4a35a', goldBg: 'rgba(196,163,90,.07)' },
  'midnight': { name: 'Midnight', group: 'dark', bg: '#0c1220', sf: '#111827', sf2: '#1a2332', sf3: '#243044', bd: '#2a3a50', bd2: '#3d5068', bd3: '#506880', tx: '#e2e8f0', tx2: '#94a3b8', tx3: '#64748b', tx4: '#475569', accent: '#60a5fa', accent2: '#3b82f6', accentBg: 'rgba(96,165,250,.07)', accentBorder: 'rgba(96,165,250,.18)', green: '#34d399', greenBg: 'rgba(52,211,153,.07)', rose: '#fb7185', roseBg: 'rgba(251,113,133,.07)', violet: '#a78bfa', violetBg: 'rgba(167,139,250,.07)', gold: '#fbbf24', goldBg: 'rgba(251,191,36,.07)' },
  'charcoal': { name: 'Charcoal', group: 'dark', bg: '#111111', sf: '#1a1a1a', sf2: '#222222', sf3: '#2a2a2a', bd: '#333333', bd2: '#444444', bd3: '#555555', tx: '#e5e5e5', tx2: '#a3a3a3', tx3: '#737373', tx4: '#525252', accent: '#f59e0b', accent2: '#d97706', accentBg: 'rgba(245,158,11,.06)', accentBorder: 'rgba(245,158,11,.15)', green: '#22c55e', greenBg: 'rgba(34,197,94,.06)', rose: '#ef4444', roseBg: 'rgba(239,68,68,.06)', violet: '#a855f7', violetBg: 'rgba(168,85,247,.06)', gold: '#eab308', goldBg: 'rgba(234,179,8,.06)' },
  'forest': { name: 'Deep Forest', group: 'dark', bg: '#0d1510', sf: '#131e16', sf2: '#1a281e', sf3: '#223026', bd: '#2a3d30', bd2: '#3d5544', bd3: '#506d58', tx: '#e0e8e2', tx2: '#a0b0a5', tx3: '#6d8070', tx4: '#506050', accent: '#4ade80', accent2: '#22c55e', accentBg: 'rgba(74,222,128,.06)', accentBorder: 'rgba(74,222,128,.15)', green: '#4ade80', greenBg: 'rgba(74,222,128,.06)', rose: '#f87171', roseBg: 'rgba(248,113,113,.06)', violet: '#c084fc', violetBg: 'rgba(192,132,252,.06)', gold: '#facc15', goldBg: 'rgba(250,204,21,.06)' },
  'clean-white': { name: 'Clean White', group: 'light', bg: '#fafafa', sf: '#ffffff', sf2: '#f5f5f5', sf3: '#eeeeee', bd: '#e5e5e5', bd2: '#d4d4d4', bd3: '#a3a3a3', tx: '#171717', tx2: '#525252', tx3: '#737373', tx4: '#a3a3a3', accent: '#2563eb', accent2: '#1d4ed8', accentBg: 'rgba(37,99,235,.06)', accentBorder: 'rgba(37,99,235,.15)', green: '#16a34a', greenBg: 'rgba(22,163,74,.06)', rose: '#dc2626', roseBg: 'rgba(220,38,38,.06)', violet: '#7c3aed', violetBg: 'rgba(124,58,237,.06)', gold: '#ca8a04', goldBg: 'rgba(202,138,4,.06)' },
  'warm-cream': { name: 'Warm Cream', group: 'light', bg: '#f8f5f0', sf: '#ffffff', sf2: '#faf7f2', sf3: '#f0ece5', bd: '#e5dfd6', bd2: '#d4cdc2', bd3: '#b5ad9f', tx: '#2c2820', tx2: '#5c564a', tx3: '#8a8278', tx4: '#b5ad9f', accent: '#b45309', accent2: '#92400e', accentBg: 'rgba(180,83,9,.06)', accentBorder: 'rgba(180,83,9,.15)', green: '#15803d', greenBg: 'rgba(21,128,61,.06)', rose: '#be123c', roseBg: 'rgba(190,18,60,.06)', violet: '#7e22ce', violetBg: 'rgba(126,34,206,.06)', gold: '#a16207', goldBg: 'rgba(161,98,7,.06)' },
  'paper': { name: 'Paper', group: 'light', bg: '#f0ebe3', sf: '#f8f3eb', sf2: '#ede8e0', sf3: '#e5dfd6', bd: '#d8d2c8', bd2: '#c4bcb0', bd3: '#a89f90', tx: '#2a2520', tx2: '#5a534a', tx3: '#8a8070', tx4: '#b0a898', accent: '#4a6fa5', accent2: '#3a5f95', accentBg: 'rgba(74,111,165,.07)', accentBorder: 'rgba(74,111,165,.18)', green: '#4a8c5c', greenBg: 'rgba(74,140,92,.07)', rose: '#a85050', roseBg: 'rgba(168,80,80,.07)', violet: '#7a6aa0', violetBg: 'rgba(122,106,160,.07)', gold: '#9a7a30', goldBg: 'rgba(154,122,48,.07)' },
  'steel': { name: 'Steel', group: 'light', bg: '#e8eaed', sf: '#f2f3f5', sf2: '#ecedf0', sf3: '#dddee2', bd: '#cccdd2', bd2: '#b8b9bf', bd3: '#98999f', tx: '#1a1c1e', tx2: '#4a4d52', tx3: '#6e7278', tx4: '#98999f', accent: '#5b7fb5', accent2: '#4a6ea5', accentBg: 'rgba(91,127,181,.07)', accentBorder: 'rgba(91,127,181,.18)', green: '#4a9a6a', greenBg: 'rgba(74,154,106,.07)', rose: '#b55555', roseBg: 'rgba(181,85,85,.07)', violet: '#7a6aaa', violetBg: 'rgba(122,106,170,.07)', gold: '#a08030', goldBg: 'rgba(160,128,48,.07)' },
}

function applyTheme(t) {
  const r = document.documentElement.style
  r.setProperty('--bg', t.bg); r.setProperty('--sf', t.sf); r.setProperty('--sf2', t.sf2); r.setProperty('--sf3', t.sf3)
  r.setProperty('--bd', t.bd); r.setProperty('--bd2', t.bd2); r.setProperty('--bd3', t.bd3)
  r.setProperty('--tx', t.tx); r.setProperty('--tx2', t.tx2); r.setProperty('--tx3', t.tx3); r.setProperty('--tx4', t.tx4)
  r.setProperty('--accent', t.accent); r.setProperty('--accent2', t.accent2); r.setProperty('--accent-bg', t.accentBg); r.setProperty('--accent-border', t.accentBorder)
  r.setProperty('--green', t.green); r.setProperty('--green-bg', t.greenBg)
  r.setProperty('--rose', t.rose); r.setProperty('--rose-bg', t.roseBg)
  r.setProperty('--violet', t.violet); r.setProperty('--violet-bg', t.violetBg)
  r.setProperty('--gold', t.gold); r.setProperty('--gold-bg', t.goldBg)
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function calcPeso(c, l, e) { if (!c || !l || !e) return 0; return (c * l * e * AL_DENSITY) / 1000000 }
function horasDiff(i, f) {
  if (!i || !f) return 0
  const [h1, m1] = i.split(':').map(Number), [h2, m2] = f.split(':').map(Number)
  let d = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (d < 0) d += 1440
  return d / 60
}
function fmtH(h) {
  if (!h || h <= 0) return '0h 00m'
  const hr = Math.floor(h), mn = Math.round((h - hr) * 60)
  return `${hr}h ${String(mn).padStart(2, '0')}m`
}
function fmtKgH(v) { if (!v || v <= 0) return '—'; return v.toFixed(1) + ' kg/h' }

// ═══════════════════════════════════════════════
// SUPABASE API FUNCTIONS
// ═══════════════════════════════════════════════
const API = {
  // CHAPAS
  async getChapas() {
    const { data, error } = await supabase.from('chapas').select('*').order('comprimento')
    if (error) { console.error('Erro ao buscar chapas:', error); return [] }
    return data.map(c => ({ id: c.id, nome: c.nome, c: c.comprimento, l: c.largura, e: c.espessura }))
  },

  async addChapa(nome, c, l, e) {
    const { data, error } = await supabase.from('chapas')
      .insert({ nome: nome.toUpperCase(), comprimento: c, largura: l, espessura: e })
      .select().single()
    if (error) { console.error('Erro ao adicionar chapa:', error); return null }
    return { id: data.id, nome: data.nome, c: data.comprimento, l: data.largura, e: data.espessura }
  },

  async deleteChapa(id) {
    const { error } = await supabase.from('chapas').delete().eq('id', id)
    if (error) console.error('Erro ao deletar chapa:', error)
    return !error
  },

  // ORDENS DE SERVIÇO
  async getOS() {
    const { data, error } = await supabase
      .from('ordens_servico')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { console.error('Erro ao buscar OS:', error); return [] }
    return data
  },

  async saveOS(osData) {
    const { data, error } = await supabase
      .from('ordens_servico')
      .upsert({
        id: osData.id || undefined,
        numero: osData.osNum,
        cliente: osData.cliente,
        data: osData.data,
        chapa_id: osData.chapaId,
        chapa_nome: osData.chapaNome,
        qtd_chapas: osData.qtd,
        qtd_pedacos: osData.pedacos,
        corte_mm: osData.corte,
        desbaste_mm: osData.desbaste,
        laminar_pct: osData.laminar,
        medida_final: osData.medida,
        tempera: osData.tempera,
        palete_numero: osData.paleteNum,
        observacoes: osData.observacoes,
        peso_total_chapas: osData.pesoTotalChapas,
        peso_total_pedacos: osData.pesoTotalPedacos,
        peso_chapa_unit: osData.pesoChapaUnit,
        peso_pedaco_unit: osData.pesoPedacoUnit,
        esp_removida: osData.espRemovida,
        peso_removido: osData.pesoRemovido,
      })
      .select()
      .single()
    if (error) { console.error('Erro ao salvar OS:', error); return null }
    return data
  },

  async deleteOS(id) {
    // Deleta cascata: lancamentos são deletados automaticamente
    const { error } = await supabase.from('ordens_servico').delete().eq('id', id)
    if (error) console.error('Erro ao deletar OS:', error)
    return !error
  },

  // LANÇAMENTOS
  async getLancamentos(osId) {
    const { data, error } = await supabase
      .from('lancamentos')
      .select('*')
      .eq('os_id', osId)
      .order('created_at')
    if (error) { console.error('Erro ao buscar lançamentos:', error); return [] }
    return data.map(l => ({
      id: l.id, m: l.maquina, op: l.operador, i: l.hora_inicio, f: l.hora_fim,
      meal: l.tem_almoco, operacao: l.operacao
    }))
  },

  async getAllLancamentos() {
    const { data, error } = await supabase
      .from('lancamentos')
      .select('*')
      .order('created_at')
    if (error) { console.error('Erro ao buscar lançamentos:', error); return [] }
    return data
  },

  async addLancamento(osId, op, lancamento) {
    const hB = horasDiff(lancamento.i, lancamento.f)
    const hP = lancamento.meal && hB > MEAL_H ? hB - MEAL_H : hB
    const { data, error } = await supabase
      .from('lancamentos')
      .insert({
        os_id: osId,
        operacao: op,
        maquina: lancamento.m,
        operador: lancamento.op.toUpperCase(),
        hora_inicio: lancamento.i,
        hora_fim: lancamento.f,
        tem_almoco: lancamento.meal,
        horas_brutas: hB,
        horas_produtivas: hP,
      })
      .select()
      .single()
    if (error) { console.error('Erro ao adicionar lançamento:', error); return null }
    return { id: data.id, m: data.maquina, op: data.operador, i: data.hora_inicio, f: data.hora_fim, meal: data.tem_almoco, operacao: data.operacao }
  },

  async deleteLancamento(id) {
    const { error } = await supabase.from('lancamentos').delete().eq('id', id)
    if (error) console.error('Erro ao deletar lançamento:', error)
    return !error
  },

  async toggleAlmoco(id, currentValue) {
    const { error } = await supabase.from('lancamentos').update({ tem_almoco: !currentValue }).eq('id', id)
    if (error) console.error('Erro ao atualizar almoço:', error)
    return !error
  }
}

// ═══════════════════════════════════════════════
// STABLE COMPONENTS (memoized)
// ═══════════════════════════════════════════════
const OsBar = memo(function OsBar({ osNum, osStatus, onOsNumChange, onSave, onNew }) {
  const handleChange = useCallback((e) => {
    onOsNumChange(e.target.value.toUpperCase())
  }, [onOsNumChange])

  return (
    <div className="os-bar">
      <div className="os-field">
        <label>Nº OS</label>
        <input
          value={osNum}
          onChange={handleChange}
          placeholder="Ex: OS-2025-0001"
          spellCheck={false}
          autoComplete="off"
        />
        <span className={`os-status ${osStatus}`}>
          {osStatus === 'saved' ? '✓ SALVA' : 'RASCUNHO'}
        </span>
      </div>
      <div className="os-actions">
        <button className="btn btn-g btn-sm" onClick={onSave}>💾 SALVAR OS</button>
        <button className="btn btn-w btn-sm" onClick={onNew}>📄 NOVA OS</button>
      </div>
    </div>
  )
})

const ThemePanel = memo(function ThemePanel({ currentTheme, showPanel, onToggle, onSelect }) {
  useEffect(() => {
    const h = (e) => {
      if (!e.target.closest('.theme-fab') && !e.target.closest('.theme-panel')) onToggle(false)
    }
    if (showPanel) document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [showPanel, onToggle])

  return <>
    <button className={`theme-fab ${showPanel ? 'open' : ''}`} onClick={() => onToggle(!showPanel)} title="Temas">
      {THEMES[currentTheme]?.group === 'dark' ? '🌙' : '☀️'}
    </button>
    {showPanel && <div className="theme-panel">
      <div className="theme-panel-hd">Temas</div>
      <div className="theme-group">
        <div className="theme-group-label">Escuros</div>
        {Object.entries(THEMES).filter(([, t]) => t.group === 'dark').map(([key, t]) => (
          <div key={key} className={`theme-opt ${currentTheme === key ? 'active' : ''}`} onClick={() => onSelect(key)}>
            <div className="theme-dot" style={{ background: t.bg, borderColor: t.bd }}></div>{t.name}
            <span className="theme-check">✓</span>
          </div>))}
      </div>
      <div className="theme-group">
        <div className="theme-group-label">Claros</div>
        {Object.entries(THEMES).filter(([, t]) => t.group === 'light').map(([key, t]) => (
          <div key={key} className={`theme-opt ${currentTheme === key ? 'active' : ''}`} onClick={() => onSelect(key)}>
            <div className="theme-dot" style={{ background: t.bg, borderColor: t.bd }}></div>{t.name}
            <span className="theme-check">✓</span>
          </div>))}
      </div>
    </div>}
  </>
})

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function App() {
  const [currentTheme, setCurrentTheme] = useState('warm-dark')
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pedido')
  const [plates, setPlates] = useState([])
  const [osNum, setOsNum] = useState('')
  const [osStatus, setOsStatus] = useState('draft')
  const [currentOsId, setCurrentOsId] = useState(null)
  const [ord, setOrd] = useState({
    cliente: '', data: new Date().toISOString().slice(0, 10),
    tipoId: '', qtd: '', pedacos: '', desb: '', corte: '',
    lam: '', medida: '', tempera: ''
  })
  const [logs, setLogs] = useState({ desbaste: [], corte: [], laminar: [], expedicao: [] })
  const [forms, setForms] = useState({
    desbaste: { m: '', op: '', i: '', f: '', meal: false },
    corte: { m: '', op: '', i: '', f: '', meal: false },
    laminar: { m: '', op: '', i: '', f: '', meal: false },
    expedicao: { m: '', op: '', i: '', f: '', meal: false }
  })
  const [savedOS, setSavedOS] = useState([])
  const [compareIds, setCompareIds] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newPlate, setNewPlate] = useState({ nome: '', c: '', l: 800, e: 9.20 })
  const [observacoes, setObservacoes] = useState('')

  // ═══ LOAD INITIAL DATA ═══
  useEffect(() => {
    applyTheme(THEMES[currentTheme])
  }, [currentTheme])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [chapasData, osData] = await Promise.all([
        API.getChapas(),
        API.getOS()
      ])
      setPlates(chapasData.length > 0 ? chapasData : [
        { id: 1, nome: 'CHAPA 100', c: 100, l: 800, e: 9.20 },
        { id: 2, nome: 'CHAPA 150', c: 150, l: 800, e: 9.20 },
        { id: 3, nome: 'CHAPA 200', c: 200, l: 800, e: 9.20 },
        { id: 4, nome: 'CHAPA 250', c: 250, l: 800, e: 9.20 },
        { id: 5, nome: 'CHAPA 320', c: 320, l: 800, e: 9.20 },
        { id: 6, nome: 'CHAPA 400', c: 400, l: 800, e: 9.20 },
        { id: 7, nome: 'CHAPA 500', c: 500, l: 800, e: 9.20 },
        { id: 8, nome: 'CHAPA 600', c: 600, l: 800, e: 9.20 },
        { id: 9, nome: 'CHAPA 800', c: 800, l: 800, e: 9.20 },
        { id: 10, nome: 'CHAPA 1000', c: 1000, l: 800, e: 9.20 },
      ])
      setSavedOS(osData)
      setLoading(false)
    }
    loadData()
  }, [])

  // ═══ CALCULATIONS ═══
  const plateSel = plates.find(p => p.id === Number(ord.tipoId))
  const espPedaco = Number(ord.desb) || 0
  const corteVal = Number(ord.corte) || 0
  const qtd = Number(ord.qtd) || 0
  const nPed = Number(ord.pedacos) || 0
  const pesoChapaUnit = plateSel ? calcPeso(plateSel.c, plateSel.l, plateSel.e) : 0
  const pesoTotalChapas = pesoChapaUnit * qtd
  const largPedaco = plateSel ? plateSel.c : 0
  const compPedaco = corteVal
  const espChapa = plateSel ? plateSel.e : 9.20
  const pesoPedaco = calcPeso(compPedaco, largPedaco, espPedaco)
  const pesoTotalPedacos = pesoPedaco * nPed

  const opSum = useMemo(() => {
    const r = {}
    OPS.forEach(op => {
      const entries = logs[op]
      let horas = 0
      entries.forEach(e => {
        let h = horasDiff(e.i, e.f)
        if (e.meal && h > MEAL_H) h -= MEAL_H
        horas += h
      })
      const oeeCh = horas > 0 && pesoTotalChapas > 0 ? pesoTotalChapas / horas : 0
      const oeePc = horas > 0 && pesoTotalPedacos > 0 ? pesoTotalPedacos / horas : 0
      r[op] = { horas, n: entries.length, oeeCh, oeePc }
    })
    const tH = OPS.reduce((s, op) => s + (r[op]?.horas || 0), 0)
    r._t = {
      horas: tH,
      oeeCh: tH > 0 && pesoTotalChapas > 0 ? pesoTotalChapas / tH : 0,
      oeePc: tH > 0 && pesoTotalPedacos > 0 ? pesoTotalPedacos / tH : 0
    }
    return r
  }, [logs, pesoTotalChapas, pesoTotalPedacos])

  // ═══ CALLBACKS ═══
  const handleOsNumChange = useCallback((val) => {
    setOsNum(val)
    setOsStatus('draft')
  }, [])

  const setO = useCallback((k, v) => setOrd(p => ({ ...p, [k]: v })), [])
  const setF = useCallback((o, k, v) => setForms(p => ({ ...p, [o]: { ...p[o], [k]: v } })), [])

  const handleSaveOS = useCallback(async () => {
    if (!osNum.trim()) { alert('INFORME O NÚMERO DA OS ANTES DE SALVAR.'); return }
    const result = await API.saveOS({
      id: currentOsId,
      osNum, cliente: ord.cliente, data: ord.data,
      chapaId: ord.tipoId, chapaNome: plateSel?.nome || '',
      qtd, pedacos: nPed, corte: corteVal, desbaste: espPedaco,
      laminar: ord.lam, medida: ord.medida, tempera: ord.tempera,
      paleteNum: '', observacoes,
      pesoTotalChapas, pesoTotalPedacos, pesoChapaUnit, pesoPedacoUnit: pesoPedaco,
      espRemovida: espPedaco > 0 ? espChapa - espPedaco : 0,
      pesoRemovido: (calcPeso(compPedaco, largPedaco, espChapa) - pesoPedaco) * nPed,
    })
    if (result) {
      setCurrentOsId(result.id)
      setOsStatus('saved')
      // Reload OS list
      const osData = await API.getOS()
      setSavedOS(osData)
    }
  }, [osNum, ord, currentOsId, plateSel, qtd, nPed, corteVal, espPedaco, espChapa, compPedaco, largPedaco, pesoPedaco, pesoTotalChapas, pesoTotalPedacos, pesoChapaUnit, observacoes])

  const handleNewOS = useCallback(() => {
    if (osStatus === 'draft' && (ord.cliente || osNum)) {
      if (!confirm('CRIAR NOVA OS? OS DADOS ATUAIS NÃO SALVOS SERÃO PERDIDOS.')) return
    }
    setOsNum(''); setOsStatus('draft'); setCurrentOsId(null)
    setOrd({ cliente: '', data: new Date().toISOString().slice(0, 10), tipoId: '', qtd: '', pedacos: '', desb: '', corte: '', lam: '', medida: '', tempera: '' })
    setLogs({ desbaste: [], corte: [], laminar: [], expedicao: [] })
    setForms({ desbaste: { m: '', op: '', i: '', f: '', meal: false }, corte: { m: '', op: '', i: '', f: '', meal: false }, laminar: { m: '', op: '', i: '', f: '', meal: false }, expedicao: { m: '', op: '', i: '', f: '', meal: false } })
    setObservacoes(''); setTab('pedido')
  }, [osStatus, ord, osNum])

  const loadOS = useCallback(async (os) => {
    setOsNum(os.numero || ''); setOsStatus('saved'); setCurrentOsId(os.id)
    setOrd({
      cliente: os.cliente || '', data: os.data || '',
      tipoId: os.chapa_id?.toString() || '', qtd: os.qtd_chapas?.toString() || '',
      pedacos: os.qtd_pedacos?.toString() || '', desb: os.desbaste_mm?.toString() || '',
      corte: os.corte_mm?.toString() || '', lam: os.laminar_pct?.toString() || '',
      medida: os.medida_final || '', tempera: os.tempera || ''
    })
    setObservacoes(os.observacoes || '')
    // Load lancamentos
    const lancData = await API.getLancamentos(os.id)
    const newLogs = { desbaste: [], corte: [], laminar: [], expedicao: [] }
    lancData.forEach(l => {
      if (newLogs[l.operacao]) newLogs[l.operacao].push(l)
    })
    setLogs(newLogs)
    setTab('pedido')
  }, [])

  const deleteOS = useCallback(async (id) => {
    if (!confirm('EXCLUIR ESTA OS?')) return
    await API.deleteOS(id)
    setSavedOS(p => p.filter(o => o.id !== id))
    if (currentOsId === id) handleNewOS()
  }, [currentOsId, handleNewOS])

  const toggleCompare = useCallback((id) => {
    setCompareIds(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 4 ? [...p, id] : p)
  }, [])

  const addLog = useCallback(async (op) => {
    const f = forms[op]
    if (!f.m || !f.op || !f.i || !f.f) return
    if (!currentOsId) {
      alert('SALVE A OS PRIMEIRO ANTES DE ADICIONAR LANÇAMENTOS.')
      return
    }
    const result = await API.addLancamento(currentOsId, op, f)
    if (result) {
      setLogs(p => ({ ...p, [op]: [...p[op], result] }))
      setForms(p => ({ ...p, [op]: { m: '', op: '', i: '', f: '', meal: false } }))
    }
  }, [forms, currentOsId])

  const delLog = useCallback(async (op, id) => {
    await API.deleteLancamento(id)
    setLogs(p => ({ ...p, [op]: p[op].filter(e => e.id !== id) }))
  }, [])

  const togLog = useCallback(async (op, id) => {
    const entry = logs[op].find(e => e.id === id)
    if (!entry) return
    await API.toggleAlmoco(id, entry.meal)
    setLogs(p => ({ ...p, [op]: p[op].map(e => e.id === id ? { ...e, meal: !e.meal } : e) }))
  }, [logs])

  const addPlate = useCallback(async () => {
    if (!newPlate.nome || !newPlate.c) return
    const result = await API.addChapa(newPlate.nome, Number(newPlate.c), Number(newPlate.l || 800), Number(newPlate.e || 9.20))
    if (result) {
      setPlates(p => [...p, result])
      setNewPlate({ nome: '', c: '', l: 800, e: 9.20 })
      setShowModal(false)
    }
  }, [newPlate])

  const delPlate = useCallback(async (id) => {
    await API.deleteChapa(id)
    setPlates(p => p.filter(x => x.id !== id))
  }, [])

  // ═══ CALC OEE FOR RANKING ═══
  const calcOsOee = useCallback(async (os) => {
    const lancs = await API.getLancamentos(os.id)
    const lamLancs = lancs.filter(l => l.operacao === 'laminar')
    let horas = 0
    lamLancs.forEach(l => {
      let h = horasDiff(l.i, l.f)
      if (l.meal && h > MEAL_H) h -= MEAL_H
      horas += h
    })
    const pesoCh = os.peso_total_chapas || 0
    const pesoPc = os.peso_total_pedacos || 0
    return {
      lamCh: horas > 0 && pesoCh > 0 ? pesoCh / horas : 0,
      lamPc: horas > 0 && pesoPc > 0 ? pesoPc / horas : 0,
      horas
    }
  }, [])

  // ═══ RANKING DATA ═══
  const [rankingData, setRankingData] = useState([])
  useEffect(() => {
    async function loadRanking() {
      const data = await Promise.all(savedOS.map(async os => {
        const oee = await calcOsOee(os)
        return { ...os, ...oee }
      }))
      setRankingData(data.filter(o => o.lamCh > 0 || o.lamPc > 0))
    }
    if (savedOS.length > 0 && tab === 'ranking') loadRanking()
  }, [savedOS, tab, calcOsOee])

  // ═══ RENDER FUNCTIONS ═══
  const renderOeeDuo = (op) => {
    const s = opSum[op], isD = op === 'desbaste'
    const tot = pesoTotalChapas + pesoTotalPedacos
    const pctCh = tot > 0 ? (pesoTotalChapas / tot * 100) : 50
    const pctPc = tot > 0 ? (pesoTotalPedacos / tot * 100) : 50
    return (<>
      <div className="sg">
        <div className="sc"><div className="v">{fmtH(s.horas)}</div><div className="l">HORAS PRODUTIVAS</div></div>
        <div className="sc"><div className="v">{s.n}</div><div className="l">LANÇAMENTOS</div></div>
      </div>
      <div className="oee-duo">
        <div className="oee-panel ch">
          <div className="ot">CHAPAS</div>
          <div className="ov">
            <div className="oi"><div className="ovv">{pesoTotalChapas.toFixed(2)}</div><div className="ol">PESO (KG)</div></div>
            <div className="oi"><div className="ovv">{fmtKgH(s.oeeCh)}</div><div className="ol">OEE (KG/H)</div></div>
          </div>
          <div className="fbox" style={{ marginTop: '.6rem', marginBottom: 0, fontSize: '.58rem' }}>
            {pesoTotalChapas.toFixed(2)} KG ÷ {fmtH(s.horas)} = <strong className="hl">{fmtKgH(s.oeeCh)}</strong>
          </div>
        </div>
        {!isD && <div className="oee-panel pc">
          <div className="ot">PEDAÇOS</div>
          <div className="ov">
            <div className="oi"><div className="ovv">{pesoTotalPedacos.toFixed(2)}</div><div className="ol">PESO (KG)</div></div>
            <div className="oi"><div className="ovv">{fmtKgH(s.oeePc)}</div><div className="ol">OEE (KG/H)</div></div>
          </div>
        </div>}
      </div>
      {!isD && pesoTotalPedacos > 0 && <div className="oee-diff">
        <span className="df-l">DIFERENÇA</span>
        <span className="df-v">{Math.abs(pesoTotalChapas - pesoTotalPedacos).toFixed(2)} KG</span>
        <div className="df-bar">
          <div className="df-ch" style={{ width: `${pctCh}%` }}></div>
          <div className="df-pc" style={{ width: `${pctPc}%` }}></div>
        </div>
        <span className="df-tag ch">CHAPAS {pctCh.toFixed(0)}%</span>
        <span className="df-tag pc">PEDAÇOS {pctPc.toFixed(0)}%</span>
      </div>}
    </>)
  }

  const renderPedido = () => (<div>
    <div className="sec">
      <div className="sec-hd"><span className="sec-t">DADOS DO PEDIDO</span></div>
      <div className="fg">
        <div className="fi" style={{ gridColumn: 'span 2' }}>
          <label>CLIENTE</label>
          <input value={ord.cliente} onChange={e => setO('cliente', e.target.value.toUpperCase())} placeholder="NOME DO CLIENTE" spellCheck={false} autoComplete="off" />
        </div>
        <div className="fi"><label>DATA</label><input type="date" value={ord.data} onChange={e => setO('data', e.target.value)} /></div>
        <div className="fi">
          <label>TIPO DE PLACA</label>
          <select value={ord.tipoId} onChange={e => setO('tipoId', e.target.value)}>
            <option value="">SELECIONAR...</option>
            {plates.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.c}×{p.l}×{p.e}MM</option>)}
          </select>
        </div>
        <div className="fi"><label>QTD CHAPAS</label><input type="number" min="0" value={ord.qtd} onChange={e => setO('qtd', e.target.value)} placeholder="0" autoComplete="off" /></div>
        <div className="fi"><label>QTD PEDAÇOS</label><input type="number" min="0" value={ord.pedacos} onChange={e => setO('pedacos', e.target.value)} placeholder="0" autoComplete="off" /></div>
        <div className="fi"><label>CORTE (MM)</label><input type="number" step="0.01" value={ord.corte} onChange={e => setO('corte', e.target.value)} placeholder="COMPRIMENTO" autoComplete="off" /></div>
        <div className="fi"><label>DESBASTE (MM)</label><input type="number" step="0.01" value={ord.desb} onChange={e => setO('desb', e.target.value)} placeholder="ESPESSURA FINAL" autoComplete="off" /></div>
        <div className="fi"><label>LAMINAR (%)</label><input type="number" step="0.01" value={ord.lam} onChange={e => setO('lam', e.target.value)} placeholder="0,00" autoComplete="off" /></div>
        <div className="fi"><label>MEDIDA FINAL</label><input value={ord.medida} onChange={e => setO('medida', e.target.value.toUpperCase())} placeholder="330 X 1,00" spellCheck={false} autoComplete="off" /></div>
        <div className="fi"><label>TEMPERA</label><input value={ord.tempera} onChange={e => setO('tempera', e.target.value.toUpperCase())} placeholder="T6" maxLength={5} spellCheck={false} autoComplete="off" /></div>
      </div>
    </div>
    {plateSel && qtd > 0 && <div className="sec">
      <div className="sec-hd"><span className="sec-t">PESO DAS CHAPAS</span></div>
      <div className="sg">
        <div className="sc bl"><div className="v">{pesoChapaUnit.toFixed(3)}</div><div className="l">PESO/CHAPA (KG)</div></div>
        <div className="sc"><div className="v">{qtd}</div><div className="l">QUANTIDADE</div></div>
        <div className="sc gn"><div className="v">{pesoTotalChapas.toFixed(2)}</div><div className="l">PESO TOTAL (KG)</div></div>
      </div>
      <div className="fbox"><strong>CHAPA:</strong> {plateSel.c}×{plateSel.l}×{plateSel.e}×<span className="hl">{AL_DENSITY}</span>÷1M = <strong className="hl">{pesoChapaUnit.toFixed(3)} KG</strong></div>
    </div>}
    {plateSel && nPed > 0 && <div className="sec">
      <div className="sec-hd"><span className="sec-t">PESO DOS PEDAÇOS</span></div>
      {(!corteVal || !espPedaco) ? <div className="al al-w">⚠ INFORME CORTE E DESBASTE</div>
        : <><div className="sg">
          <div className="sc gn"><div className="v">{pesoPedaco.toFixed(3)}</div><div className="l">PESO/PEDAÇO (KG)</div></div>
          <div className="sc"><div className="v">{nPed}</div><div className="l">QUANTIDADE</div></div>
          <div className="sc gn"><div className="v">{pesoTotalPedacos.toFixed(2)}</div><div className="l">PESO TOTAL (KG)</div></div>
        </div></>}
    </div>}
    {plateSel && qtd > 0 && nPed > 0 && corteVal > 0 && espPedaco > 0 && <div className="sec">
      <div className="sec-hd"><span className="sec-t">COMPARAÇÃO</span></div>
      {ord.medida && <div className="al al-s" style={{ marginBottom: '1rem' }}>📏 MEDIDA FINAL: <strong>{ord.medida}</strong></div>}
      <div className="cmp">
        <div className="cmp-s ch"><div className="cl">CHAPAS ({qtd})</div><div className="cv">{pesoTotalChapas.toFixed(2)} KG</div></div>
        <div className="cmp-m"><div className="cmp-a">⟷</div><div className="cmp-d">Δ {Math.abs(pesoTotalChapas - pesoTotalPedacos).toFixed(2)} KG</div></div>
        <div className="cmp-s pc"><div className="cl">PEDAÇOS ({nPed})</div><div className="cv">{pesoTotalPedacos.toFixed(2)} KG</div></div>
      </div>
    </div>}
  </div>)

  const renderOp = (op) => {
    const f = forms[op], entries = logs[op]
    return (<div>
      <div className="sec">
        <div className="sec-hd"><span className="sec-t">{OP_L[op]}</span><span className="sec-badge">{entries.length} LANÇAMENTOS</span></div>
        {!currentOsId && <div className="al al-w">⚠ SALVE A OS PRIMEIRO PARA ADICIONAR LANÇAMENTOS</div>}
        {entries.length === 0 ? <div className="empty">NENHUM LANÇAMENTO</div> : entries.map(e => {
          const hB = horasDiff(e.i, e.f), hP = e.meal && hB > MEAL_H ? hB - MEAL_H : hB
          return (<div className={`ec ${e.meal ? 'meal' : ''}`} key={e.id}>
            <div className="ec-hd">
              <div className="ec-info">
                <span>MÁQ: <strong>{e.m}</strong></span>
                <span>OPER: <strong>{e.op}</strong></span>
                <span>{e.i}→{e.f}</span>
                <span className="ec-dur">{fmtH(hP)}</span>
                {e.meal && <span className="ec-meal">🍽 −1H</span>}
              </div>
              <div className="ec-acts">
                <button className={e.meal ? 'm-on' : ''} onClick={() => togLog(op, e.id)}>🍽</button>
                <button className="del" onClick={() => delLog(op, e.id)}>✕</button>
              </div>
            </div>
          </div>)
        })}
        <div className="af">
          <div className="fi"><label>MÁQUINA</label><input type="number" value={f.m} onChange={e => setF(op, 'm', e.target.value)} placeholder="001" autoComplete="off" /></div>
          <div className="fi"><label>OPERADOR</label><input value={f.op} onChange={e => setF(op, 'op', e.target.value.toUpperCase())} placeholder="NOME" spellCheck={false} autoComplete="off" /></div>
          <div className="fi"><label>INÍCIO</label><input type="time" value={f.i} onChange={e => setF(op, 'i', e.target.value)} /></div>
          <div className="fi"><label>FIM</label><input type="time" value={f.f} onChange={e => setF(op, 'f', e.target.value)} /></div>
          <div className="mcb"><input type="checkbox" id={`ml-${op}`} checked={f.meal} onChange={e => setF(op, 'meal', e.target.checked)} /><label htmlFor={`ml-${op}`}>🍽 ALMOÇO (−1H)</label></div>
          <button className="btn btn-p" onClick={() => addLog(op)}>+ ADICIONAR</button>
        </div>
      </div>
      {renderOeeDuo(op)}
    </div>)
  }

  const renderObs = () => {
    const hasD = OPS.some(op => logs[op].length > 0)
    return (<div>
      <div className="sec">
        <div className="sec-hd"><span className="sec-t">RESUMO DE HORAS</span></div>
        {!hasD ? <div className="empty">NENHUMA OPERAÇÃO</div> : <>
          <ul style={{ listStyle: 'none' }}>
            {OPS.map(op => {
              const s = opSum[op]; if (!s.n) return null
              return (<li key={op} style={{ padding: '.5rem 0', borderBottom: '1px solid var(--bd)', display: 'flex', justifyContent: 'space-between', fontSize: '.78rem' }}>
                <span style={{ color: 'var(--tx2)' }}>{OP_L[op]}</span>
                <span style={{ color: 'var(--tx)', fontWeight: 600, fontFamily: 'DM Mono,monospace' }}>{fmtH(s.horas)}</span>
              </li>)
            })}
          </ul>
          <div style={{ marginTop: '1rem', padding: '.7rem 1rem', background: 'var(--gold-bg)', border: '1px solid rgba(196,163,90,.18)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '.85rem' }}>
            <span>TOTAL</span>
            <span style={{ color: 'var(--gold)', fontFamily: 'DM Mono,monospace' }}>{fmtH(opSum._t.horas)}</span>
          </div>
        </>}
      </div>
      <div className="sec">
        <div className="sec-hd"><span className="sec-t">OBSERVAÇÕES</span></div>
        <textarea value={observacoes} onChange={e => setObservacoes(e.target.value.toUpperCase())}
          style={{ width: '100%', minHeight: '110px', padding: '.7rem', background: 'var(--sf2)', color: 'var(--tx)', border: '1px solid var(--bd)', borderRadius: '8px', resize: 'vertical', fontFamily: 'Space Grotesk,sans-serif', fontSize: '.82rem', lineHeight: '1.6', textTransform: 'uppercase' }}
          placeholder="OBSERVAÇÕES..." spellCheck={false} />
      </div>
    </div>)
  }

  const renderHistorico = () => (<div>
    <div className="sec">
      <div className="sec-hd"><span className="sec-t">ORDENS DE SERVIÇO</span><span className="sec-badge">{savedOS.length} OS</span></div>
      {loading ? <div className="empty">CARREGANDO...</div>
        : savedOS.length === 0 ? <div className="empty">NENHUMA OS SALVA.</div>
          : <div className="fg" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
            {savedOS.map(os => (
              <div key={os.id} className={`os-card ${currentOsId === os.id ? 'selected' : ''}`} onClick={() => loadOS(os)}>
                <div className="os-card-top">
                  <span className="os-card-num">{os.numero || 'S/N'}</span>
                  <span className="os-card-date">{os.data}</span>
                </div>
                <div className="os-card-client">{os.cliente || '—'}</div>
                <div className="os-card-stats">
                  <span>CHAPA: <strong>{os.chapa_nome || '—'}</strong></span>
                  <span>PESO: <strong>{(os.peso_total_chapas || 0).toFixed(2)} KG</strong></span>
                </div>
                <div className="os-card-acts">
                  <button className="btn btn-s btn-sm" onClick={e => { e.stopPropagation(); loadOS(os) }}>✏️ EDITAR</button>
                  <button className="btn btn-d btn-sm" onClick={e => { e.stopPropagation(); deleteOS(os.id) }}>🗑 EXCLUIR</button>
                </div>
              </div>
            ))}
          </div>}
    </div>
  </div>)

  const renderComparar = () => {
    const selectedOS = savedOS.filter(o => compareIds.includes(o.id))
    return (<div>
      <div className="sec">
        <div className="sec-hd"><span className="sec-t">SELECIONAR OS PARA COMPARAR</span><span className="sec-badge">{compareIds.length}/4</span></div>
        {savedOS.length === 0 ? <div className="empty">SALVE ALGUMAS OS PRIMEIRO.</div>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '.5rem' }}>
            {savedOS.map(os => (
              <div key={os.id} className={`chk-card ${compareIds.includes(os.id) ? 'active' : ''}`} onClick={() => toggleCompare(os.id)}>
                <input type="checkbox" checked={compareIds.includes(os.id)} readOnly />
                <div className="chk-info">
                  <div className="chk-os">{os.numero || 'S/N'} — {os.cliente || '—'}</div>
                  <div className="chk-detail">{os.data}</div>
                </div>
              </div>
            ))}
          </div>}
      </div>
      {selectedOS.length >= 2 && <div className="sec">
        <div className="sec-hd"><span className="sec-t">COMPARAÇÃO — {selectedOS.length} OS</span></div>
        <div className={`compare-grid ${selectedOS.length <= 2 ? 'cols-2' : selectedOS.length === 3 ? 'cols-3' : 'cols-4'}`}>
          {selectedOS.map(os => (
            <div key={os.id} className="compare-col">
              <div className="cc-header">
                <div><div className="cc-num">{os.numero || 'S/N'}</div><div className="cc-client">{os.cliente || '—'}</div></div>
              </div>
              <div className="cc-row"><span className="cc-label">DATA</span><span className="cc-val">{os.data}</span></div>
              <div className="cc-row"><span className="cc-label">CHAPA</span><span className="cc-val">{os.chapa_nome || '—'}</span></div>
              <div className="cc-row"><span className="cc-label">QTD</span><span className="cc-val">{os.qtd_chapas || 0}</span></div>
              <div className="cc-row"><span className="cc-label">PESO CHAPAS</span><span className="cc-val">{(os.peso_total_chapas || 0).toFixed(2)} KG</span></div>
              <div className="cc-row"><span className="cc-label">PESO PEDAÇOS</span><span className="cc-val">{(os.peso_total_pedacos || 0).toFixed(2)} KG</span></div>
              <div className="cc-row"><span className="cc-label">MEDIDA</span><span className="cc-val">{os.medida_final || '—'}</span></div>
              <div className="cc-row"><span className="cc-label">DIFERENÇA</span><span className="cc-val">{Math.abs((os.peso_total_chapas || 0) - (os.peso_total_pedacos || 0)).toFixed(2)} KG</span></div>
            </div>
          ))}
        </div>
      </div>}
    </div>)
  }

  const renderRanking = () => {
    const rankedCh = [...rankingData].sort((a, b) => b.lamCh - a.lamCh)
    const rankedPc = [...rankingData].sort((a, b) => b.lamPc - a.lamPc)
    const maxCh = rankedCh[0]?.lamCh || 1
    const maxPc = rankedPc[0]?.lamPc || 1
    const getPosClass = i => i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''
    const getValClass = (v, max) => v / max > .7 ? 'high' : v / max > .4 ? 'mid' : 'low'
    const getBarColor = i => i === 0 ? 'var(--gold)' : i === 1 ? 'var(--accent)' : i === 2 ? 'var(--accent2)' : 'var(--tx4)'
    return (<div>
      {rankingData.length === 0 ? <div className="sec"><div className="empty">NENHUMA OS COM DADOS DE LAMINAR.</div></div>
        : <>
          <div className="sec">
            <div className="sec-hd"><span className="sec-t">RANKING LAMINAR — OEE CHAPAS (KG/H)</span><span className="sec-badge">{rankedCh.length} OS</span></div>
            {rankedCh.map((os, i) => (<div key={os.id + 'ch'} className="rank-item">
              <div className={`rank-pos ${getPosClass(i)}`}>{i + 1}º</div>
              <div className="rank-info"><div className="rank-os">{os.numero || 'S/N'} — {os.cliente || '—'}</div><div className="rank-client">{os.data} · {os.chapa_nome || '—'}</div></div>
              <div className="rank-bar-wrap"><div className="rank-bar" style={{ width: `${os.lamCh / maxCh * 100}%`, background: getBarColor(i) }}></div></div>
              <div className={`rank-val ${getValClass(os.lamCh, maxCh)}`}>{fmtKgH(os.lamCh)}</div>
            </div>))}
          </div>
          <div className="sec">
            <div className="sec-hd"><span className="sec-t">RANKING LAMINAR — OEE PEDAÇOS (KG/H)</span><span className="sec-badge">{rankedPc.length} OS</span></div>
            {rankedPc.map((os, i) => (<div key={os.id + 'pc'} className="rank-item">
              <div className={`rank-pos ${getPosClass(i)}`}>{i + 1}º</div>
              <div className="rank-info"><div className="rank-os">{os.numero || 'S/N'} — {os.cliente || '—'}</div><div className="rank-client">{os.data} · {os.chapa_nome || '—'}</div></div>
              <div className="rank-bar-wrap"><div className="rank-bar" style={{ width: `${os.lamPc / maxPc * 100}%`, background: getBarColor(i) }}></div></div>
              <div className={`rank-val ${getValClass(os.lamPc, maxPc)}`}>{fmtKgH(os.lamPc)}</div>
            </div>))}
          </div>
        </>}
    </div>)
  }

  const renderCadastro = () => (<div>
    <div className="sec">
      <div className="sec-hd"><span className="sec-t">TIPOS DE CHAPA</span><button className="btn btn-p btn-sm" onClick={() => setShowModal(true)}>+ NOVA</button></div>
      <table className="rt">
        <thead><tr><th>NOME</th><th>COMP.</th><th>LARG.</th><th>ESP.</th><th>PESO/UN</th><th></th></tr></thead>
        <tbody>{plates.map(p => (<tr key={p.id}>
          <td><strong>{p.nome}</strong></td><td>{p.c}MM</td><td>{p.l}MM</td><td>{p.e}MM</td>
          <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{calcPeso(p.c, p.l, p.e).toFixed(3)} KG</td>
          <td><button className="btn btn-d btn-sm" onClick={() => delPlate(p.id)}>✕</button></td>
        </tr>))}</tbody>
      </table>
    </div>
    {showModal && <div className="mo" onClick={() => setShowModal(false)}>
      <div className="md" onClick={e => e.stopPropagation()}>
        <div className="md-h"><h3>Nova Chapa</h3><button style={{ background: 'none', color: 'var(--tx3)', fontSize: '1.1rem', border: 'none' }} onClick={() => setShowModal(false)}>✕</button></div>
        <div className="md-b">
          <div className="fi" style={{ marginBottom: '1rem' }}><label>NOME</label><input value={newPlate.nome} onChange={e => setNewPlate(p => ({ ...p, nome: e.target.value.toUpperCase() }))} placeholder="CHAPA 450" spellCheck={false} autoComplete="off" /></div>
          <div className="fg" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="fi"><label>COMP. (MM)</label><input type="number" value={newPlate.c} onChange={e => setNewPlate(p => ({ ...p, c: e.target.value }))} placeholder="250" autoComplete="off" /></div>
            <div className="fi"><label>LARG. (MM)</label><input type="number" value={newPlate.l} onChange={e => setNewPlate(p => ({ ...p, l: e.target.value }))} placeholder="800" autoComplete="off" /></div>
            <div className="fi"><label>ESP. (MM)</label><input type="number" step="0.01" value={newPlate.e} onChange={e => setNewPlate(p => ({ ...p, e: e.target.value }))} placeholder="9.20" autoComplete="off" /></div>
          </div>
          {newPlate.c && newPlate.l && newPlate.e && <div className="al al-s" style={{ marginTop: '1rem' }}>✓ <strong>{calcPeso(Number(newPlate.c), Number(newPlate.l), Number(newPlate.e)).toFixed(3)} KG/CHAPA</strong></div>}
        </div>
        <div className="md-f"><button className="btn btn-s" onClick={() => setShowModal(false)}>CANCELAR</button><button className="btn btn-p" onClick={addPlate}>CADASTRAR</button></div>
      </div>
    </div>}
  </div>)

  // ═══ MAIN RENDER ═══
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#131210', color: '#8b9dc3', fontFamily: 'Space Grotesk, sans-serif', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite' }}>⏳</div>
        <div>CONECTANDO AO BANCO DE DADOS...</div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
      </div>
    )
  }

  return (
    <div className="app">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="hdr">
        <div className="hdr-l">
          <div className="logo"><span>A</span></div>
          <div className="hdr-text">
            <h1>Apontamento de Produção</h1>
            <div className="sub">SISTEMA INDUSTRIAL — CONTROLE DE ALUMÍNIO</div>
          </div>
        </div>
        <div className="hdr-r"><div className="ver">v4.0 SUPABASE</div></div>
      </div>

      <OsBar osNum={osNum} osStatus={osStatus} onOsNumChange={handleOsNumChange} onSave={handleSaveOS} onNew={handleNewOS} />

      <div className="nav">
        {TABS.map(t => (<button key={t.k} className={tab === t.k ? 'on' : ''} onClick={() => setTab(t.k)}>{t.l}</button>))}
      </div>

      <div>
        {tab === 'pedido' && renderPedido()}
        {tab === 'desbaste' && renderOp('desbaste')}
        {tab === 'corte' && renderOp('corte')}
        {tab === 'laminar' && renderOp('laminar')}
        {tab === 'expedicao' && renderOp('expedicao')}
        {tab === 'obs' && renderObs()}
        {tab === 'historico' && renderHistorico()}
        {tab === 'comparar' && renderComparar()}
        {tab === 'ranking' && renderRanking()}
        {tab === 'cadastro' && renderCadastro()}
      </div>

      <ThemePanel currentTheme={currentTheme} showPanel={showThemePanel} onToggle={setShowThemePanel} onSelect={setCurrentTheme} />
    </div>
  )
}

// ═══════════════════════════════════════════════
// STYLES (same as before, embedded)
// ═══════════════════════════════════════════════
const STYLES = `
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:14px}
body{font-family:'Space Grotesk',sans-serif;background:var(--bg);color:var(--tx);min-height:100vh;line-height:1.6;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:'Instrument Serif',serif;font-weight:400}
input,select,textarea,button{font-family:'Space Grotesk',sans-serif;font-size:.85rem}
button{cursor:pointer}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:4px}
.app{max-width:1300px;margin:0 auto;padding:2rem 2.5rem 5rem;animation:fadeIn .3s ease}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 0 1.25rem;margin-bottom:1.25rem;border-bottom:1px solid var(--bd);flex-wrap:wrap;gap:.75rem}
.hdr-l{display:flex;align-items:center;gap:1.25rem}
.logo{width:40px;height:40px;border-radius:8px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:'Instrument Serif',serif;font-size:1rem;font-style:italic;line-height:1}
.logo span{color:var(--bg)}
.hdr-text h1{font-size:1.5rem;letter-spacing:-.01em;color:var(--tx);line-height:1.1}
.hdr-text .sub{font-size:.58rem;color:var(--tx4);letter-spacing:.12em;text-transform:uppercase;font-family:'DM Mono',monospace;margin-top:.2rem}
.hdr-r{display:flex;align-items:center;gap:.6rem}
.ver{font-size:.52rem;padding:.25rem .6rem;background:var(--sf2);border:1px solid var(--bd);color:var(--tx4);border-radius:12px;font-family:'DM Mono',monospace;font-weight:500}
.os-bar{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:var(--sf);border:1px solid var(--bd);border-radius:12px;margin-bottom:1.25rem;flex-wrap:wrap}
.os-bar .os-field{display:flex;align-items:center;gap:.5rem;flex:1;min-width:200px}
.os-bar .os-field label{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);white-space:nowrap}
.os-bar .os-field input{padding:.45rem .7rem;background:var(--sf2);color:var(--accent);border:1px solid var(--accent-border);border-radius:8px;outline:none;font-family:'DM Mono',monospace;font-size:.9rem;font-weight:600;width:160px;text-transform:uppercase}
.os-bar .os-field input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-bg)}
.os-bar .os-field input::placeholder{color:var(--tx4);font-weight:400;font-size:.8rem;text-transform:none}
.os-bar .os-status{font-size:.55rem;padding:.2rem .5rem;border-radius:8px;font-weight:600;white-space:nowrap}
.os-bar .os-status.draft{background:var(--gold-bg);color:var(--gold);border:1px solid rgba(196,163,90,.2)}
.os-bar .os-status.saved{background:var(--green-bg);color:var(--green);border:1px solid rgba(110,168,130,.2)}
.os-bar .os-actions{display:flex;gap:.4rem;flex-wrap:wrap}
.theme-fab{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:44px;height:44px;border-radius:50%;background:var(--accent);border:none;display:flex;align-items:center;justify-content:center;font-size:1.15rem;box-shadow:0 4px 20px rgba(0,0,0,.3)}
.theme-fab:hover{transform:scale(1.1)}
.theme-panel{position:fixed;bottom:5rem;right:1.5rem;z-index:9998;background:var(--sf);border:1px solid var(--bd);border-radius:14px;padding:1.15rem;width:220px;box-shadow:0 12px 40px rgba(0,0,0,.35);animation:slideUp .25s;max-height:70vh;overflow-y:auto}
.theme-panel-hd{font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);font-weight:700;margin-bottom:.85rem;padding-bottom:.5rem;border-bottom:1px solid var(--bd)}
.theme-group{margin-bottom:.85rem}.theme-group:last-child{margin-bottom:0}
.theme-group-label{font-size:.5rem;text-transform:uppercase;letter-spacing:.12em;color:var(--tx4);font-weight:700;margin-bottom:.5rem}
.theme-opt{display:flex;align-items:center;gap:.6rem;padding:.5rem .65rem;border-radius:8px;border:1px solid transparent;cursor:pointer;font-size:.68rem;color:var(--tx2);font-weight:500;margin-bottom:.25rem}
.theme-opt:hover{background:var(--sf2);border-color:var(--bd)}
.theme-opt.active{background:var(--accent-bg);border-color:var(--accent-border);color:var(--accent);font-weight:600}
.theme-dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--bd);flex-shrink:0}
.theme-opt.active .theme-dot{border-color:var(--accent)}
.theme-check{margin-left:auto;font-size:.7rem;opacity:0}.theme-opt.active .theme-check{opacity:1}
.nav{display:flex;gap:2px;padding:.35rem;background:var(--sf);border:1px solid var(--bd);border-radius:12px;margin-bottom:1.5rem;overflow-x:auto;position:sticky;top:.75rem;z-index:100}
.nav button{padding:.5rem .85rem;background:transparent;color:var(--tx4);font-size:.65rem;font-weight:500;letter-spacing:.02em;text-transform:uppercase;border:1px solid transparent;border-radius:8px;white-space:nowrap}
.nav button:hover{color:var(--tx2);background:var(--sf2)}
.nav button.on{color:var(--accent);background:var(--accent-bg);border-color:var(--accent-border)}
.sec{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:1.5rem;margin-bottom:1.25rem}
.sec-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem}
.sec-t{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--accent);display:flex;align-items:center;gap:.5rem}
.sec-t::before{content:'';width:2px;height:12px;background:var(--accent);border-radius:1px;opacity:.6}
.sec-badge{font-size:.58rem;padding:.2rem .6rem;background:var(--accent-bg);color:var(--accent);border-radius:14px;font-weight:600;border:1px solid var(--accent-border)}
.fg{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:.85rem;margin-bottom:1.25rem}
.fi{display:flex;flex-direction:column;gap:.3rem}
.fi label{font-size:.58rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3)}
.fi input,.fi select,.fi textarea{padding:.55rem .75rem;background:var(--sf2);color:var(--tx);border:1px solid var(--bd);border-radius:8px;outline:none;font-weight:400}
.fi select{text-transform:none}
.fi input,.fi textarea{text-transform:uppercase}
.fi input:hover,.fi select:hover{border-color:var(--bd2)}
.fi input:focus,.fi select:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-bg)}
.fi input::placeholder{color:var(--tx4);text-transform:none}
.ec{background:var(--sf2);border:1px solid var(--bd);border-radius:8px;padding:.7rem .9rem;margin-bottom:.4rem;border-left:3px solid var(--accent)}
.ec.meal{border-left-color:var(--violet)}
.ec-hd{display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap}
.ec-info{display:flex;gap:.85rem;flex-wrap:wrap;font-size:.73rem}
.ec-info span{color:var(--tx2)}.ec-info strong{color:var(--tx);font-weight:500}
.ec-dur{color:var(--accent)!important;font-weight:600!important;font-family:'DM Mono',monospace}
.ec-meal{font-size:.55rem;color:var(--violet);background:var(--violet-bg);padding:.15rem .4rem;border-radius:8px;margin-left:.3rem;font-weight:600}
.ec-acts{display:flex;gap:.25rem}
.ec-acts button{padding:.2rem .4rem;background:transparent;color:var(--tx4);border:1px solid var(--bd);border-radius:6px;font-size:.58rem}
.ec-acts button:hover{color:var(--tx2);border-color:var(--bd2)}
.ec-acts button.del:hover{color:var(--rose);border-color:var(--rose)}
.ec-acts button.m-on{color:var(--violet);border-color:var(--violet);background:var(--violet-bg)}
.af{display:flex;gap:.4rem;flex-wrap:wrap;align-items:flex-end;margin-top:.65rem;padding-top:.65rem;border-top:1px dashed var(--bd)}
.af .fi{flex:1;min-width:95px}.af .fi input{width:100%}
.mcb{display:flex;align-items:center;gap:.4rem;padding:.5rem 0;white-space:nowrap}
.mcb input{accent-color:var(--violet);width:16px;height:16px;cursor:pointer}
.mcb label{font-size:.68rem;color:var(--tx3);cursor:pointer;user-select:none;font-weight:500}
.btn{padding:.55rem 1.1rem;border-radius:8px;font-size:.68rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;display:inline-flex;align-items:center;gap:.4rem;border:none}
.btn-p{background:var(--accent);color:var(--bg)}.btn-p:hover{filter:brightness(1.15)}
.btn-s{background:var(--sf3);color:var(--tx2);border:1px solid var(--bd)}.btn-s:hover{border-color:var(--bd2);color:var(--tx)}
.btn-d{background:transparent;color:var(--rose);border:1px solid rgba(194,112,112,.25)}.btn-d:hover{background:var(--rose-bg);border-color:var(--rose)}
.btn-g{background:var(--green);color:var(--bg)}.btn-g:hover{filter:brightness(1.1)}
.btn-w{background:var(--gold);color:var(--bg)}.btn-w:hover{filter:brightness(1.1)}
.btn-sm{padding:.35rem .7rem;font-size:.62rem}
.sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.85rem;margin-bottom:1.25rem}
.sc{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:1rem 1.1rem;text-align:center;border-top:2px solid var(--accent)}
.sc .v{font-family:'DM Mono',monospace;font-size:1.25rem;font-weight:500;color:var(--accent);margin-bottom:.1rem}
.sc .l{font-size:.52rem;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);font-weight:600}
.sc.bl{border-top-color:var(--accent)}.sc.bl .v{color:var(--accent)}
.sc.gn{border-top-color:var(--green)}.sc.gn .v{color:var(--green)}
.oee-duo{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem}
.oee-panel{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:1.25rem;position:relative;overflow:hidden}
.oee-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.oee-panel.ch::before{background:var(--accent)}.oee-panel.pc::before{background:var(--green)}
.oee-panel .ot{font-size:.6rem;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3);margin-bottom:.6rem;font-weight:600;display:flex;align-items:center;gap:.4rem}
.oee-panel.ch .ot::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent)}
.oee-panel.pc .ot::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green)}
.oee-panel .ov{display:flex;gap:.75rem;flex-wrap:wrap}
.oee-panel .oi{text-align:center;flex:1;min-width:70px}
.oee-panel .ovv{font-family:'DM Mono',monospace;font-size:1.15rem;font-weight:500}
.oee-panel.ch .ovv{color:var(--accent)}.oee-panel.pc .ovv{color:var(--green)}
.oee-panel .ol{font-size:.48rem;text-transform:uppercase;letter-spacing:.05em;color:var(--tx3);margin-top:.15rem;font-weight:600}
.oee-diff{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:.85rem 1.1rem;margin-bottom:1.25rem;display:flex;align-items:center;justify-content:center;gap:.85rem;flex-wrap:wrap;font-size:.72rem}
.df-l{color:var(--tx3);font-weight:600;font-size:.6rem;text-transform:uppercase;letter-spacing:.05em}
.df-v{color:var(--gold);font-weight:600;font-family:'DM Mono',monospace}
.df-bar{flex:1;max-width:200px;height:6px;background:var(--sf3);border-radius:3px;overflow:hidden;display:flex}
.df-ch{background:var(--accent);height:100%}.df-pc{background:var(--green);height:100%}
.df-tag{font-size:.5rem;padding:.15rem .4rem;border-radius:5px;font-weight:600}
.df-tag.ch{background:var(--accent-bg);color:var(--accent)}.df-tag.pc{background:var(--green-bg);color:var(--green)}
.cmp{display:grid;grid-template-columns:1fr auto 1fr;gap:1.25rem;align-items:center;padding:1.5rem;background:var(--sf2);border:1px solid var(--bd);border-radius:12px;margin-bottom:1rem}
.cmp-s{text-align:center}.cmp-s .cl{font-size:.52rem;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3);margin-bottom:.35rem;font-weight:600}
.cmp-s .cv{font-family:'DM Mono',monospace;font-size:1.45rem;font-weight:500}.cmp-s .cs{font-size:.58rem;color:var(--tx4);margin-top:.2rem}
.cmp-m{text-align:center;padding:0 .5rem}.cmp-a{font-size:1.3rem;color:var(--tx4)}
.cmp-d{font-size:.55rem;color:var(--gold);margin-top:.2rem;font-weight:600;font-family:'DM Mono',monospace;background:var(--gold-bg);padding:.15rem .45rem;border-radius:5px}
.cmp-s.ch .cv{color:var(--accent)}.cmp-s.pc .cv{color:var(--green)}
.rt{width:100%;border-collapse:separate;border-spacing:0;font-size:.76rem}
.rt th{text-align:left;padding:.55rem .7rem;background:var(--sf2);color:var(--tx3);font-size:.52rem;text-transform:uppercase;letter-spacing:.07em;font-weight:600;border-bottom:1px solid var(--bd)}
.rt th:first-child{border-radius:8px 0 0 0}.rt th:last-child{border-radius:0 8px 0 0}
.rt td{padding:.5rem .7rem;border-bottom:1px solid var(--bd);color:var(--tx2)}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem;animation:fadeIn .2s}
.md{background:var(--sf);border:1px solid var(--bd);border-radius:16px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;animation:slideUp .25s;box-shadow:0 20px 50px rgba(0,0,0,.3)}
.md-h{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid var(--bd)}
.md-h h3{font-size:.85rem;letter-spacing:.04em;color:var(--accent)}
.md-b{padding:1.25rem}.md-f{display:flex;justify-content:flex-end;gap:.6rem;padding:.9rem 1.25rem;border-top:1px solid var(--bd)}
.empty{text-align:center;padding:2.5rem;color:var(--tx4);font-size:.78rem}
.al{padding:.6rem .9rem;border-radius:8px;font-size:.7rem;margin-bottom:.75rem;font-weight:500}
.al-w{background:var(--gold-bg);border:1px solid rgba(196,163,90,.18);color:var(--gold)}
.al-s{background:var(--green-bg);border:1px solid rgba(110,168,130,.18);color:var(--green)}
.fbox{background:var(--sf2);border:1px solid var(--bd);border-radius:8px;padding:.65rem .85rem;font-size:.68rem;color:var(--tx3);margin-top:.65rem;line-height:1.7;font-family:'DM Mono',monospace}
.fbox strong{color:var(--tx2)}.fbox .hl{color:var(--accent)}
.os-card{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:1.15rem;cursor:pointer}
.os-card:hover{border-color:var(--accent-border);box-shadow:0 4px 16px rgba(0,0,0,.15)}
.os-card.selected{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-bg)}
.os-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:.65rem}
.os-card-num{font-family:'DM Mono',monospace;font-size:.95rem;font-weight:600;color:var(--accent)}
.os-card-date{font-size:.6rem;color:var(--tx4);font-family:'DM Mono',monospace}
.os-card-client{font-size:.78rem;color:var(--tx);font-weight:500;margin-bottom:.5rem}
.os-card-stats{display:flex;gap:1rem;flex-wrap:wrap;font-size:.6rem;color:var(--tx3)}
.os-card-stats span{display:flex;align-items:center;gap:.3rem}
.os-card-stats strong{color:var(--tx2);font-weight:600}
.os-card-acts{display:flex;gap:.3rem;margin-top:.65rem;padding-top:.65rem;border-top:1px solid var(--bd)}
.os-card-acts button{font-size:.58rem;padding:.25rem .5rem}
.rank-item{display:flex;align-items:center;gap:1rem;padding:.85rem 1rem;background:var(--sf2);border:1px solid var(--bd);border-radius:10px;margin-bottom:.5rem}
.rank-pos{font-family:'DM Mono',monospace;font-size:1.1rem;font-weight:700;color:var(--accent);width:32px;text-align:center}
.rank-pos.gold{color:#f59e0b}.rank-pos.silver{color:#94a3b8}.rank-pos.bronze{color:#d97706}
.rank-info{flex:1}
.rank-os{font-family:'DM Mono',monospace;font-size:.75rem;font-weight:600;color:var(--tx)}
.rank-client{font-size:.65rem;color:var(--tx3)}
.rank-val{font-family:'DM Mono',monospace;font-size:1.2rem;font-weight:600;text-align:right}
.rank-val.high{color:var(--green)}.rank-val.mid{color:var(--accent)}.rank-val.low{color:var(--tx3)}
.rank-bar-wrap{width:120px;height:6px;background:var(--sf3);border-radius:3px;overflow:hidden}
.rank-bar{height:100%;border-radius:3px}
.compare-grid{display:grid;gap:1rem;margin-bottom:1.25rem}
.compare-grid.cols-2{grid-template-columns:1fr 1fr}
.compare-grid.cols-3{grid-template-columns:1fr 1fr 1fr}
.compare-grid.cols-4{grid-template-columns:repeat(4,1fr)}
.compare-col{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:1.15rem}
.compare-col.best{border-color:var(--green);box-shadow:0 0 0 3px var(--green-bg)}
.compare-col .cc-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;padding-bottom:.6rem;border-bottom:1px solid var(--bd)}
.compare-col .cc-num{font-family:'DM Mono',monospace;font-weight:700;color:var(--accent)}
.compare-col .cc-client{font-size:.7rem;color:var(--tx3)}
.compare-col .cc-row{display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px dashed var(--bd);font-size:.72rem}
.compare-col .cc-row:last-child{border-bottom:none}
.compare-col .cc-label{color:var(--tx3)}
.compare-col .cc-val{font-family:'DM Mono',monospace;font-weight:600;color:var(--tx)}
.chk-card{display:flex;align-items:center;gap:.6rem;padding:.6rem .85rem;background:var(--sf2);border:1px solid var(--bd);border-radius:8px;cursor:pointer;margin-bottom:.35rem}
.chk-card:hover{border-color:var(--bd2)}
.chk-card.active{border-color:var(--accent);background:var(--accent-bg)}
.chk-card input{accent-color:var(--accent);width:16px;height:16px;cursor:pointer}
.chk-card .chk-info{flex:1;font-size:.72rem}
.chk-card .chk-os{font-family:'DM Mono',monospace;font-weight:600;color:var(--tx)}
.chk-card .chk-detail{font-size:.6rem;color:var(--tx3)}
@media(max-width:768px){.app{padding:1rem 1.25rem 5rem}.hdr{flex-direction:column;align-items:flex-start;gap:.5rem}.os-bar{flex-direction:column;align-items:stretch}.os-bar .os-field{width:100%}.os-bar .os-field input{width:100%}.fg{grid-template-columns:1fr 1fr}.sg{grid-template-columns:repeat(2,1fr)}.oee-duo{grid-template-columns:1fr}.cmp{grid-template-columns:1fr;gap:.75rem}.cmp-m{transform:rotate(90deg)}.af{flex-direction:column}.af .fi{min-width:100%}.nav button{padding:.45rem .6rem;font-size:.58rem}.compare-grid{grid-template-columns:1fr!important}.rank-bar-wrap{display:none}}
@media(max-width:480px){.fg{grid-template-columns:1fr}}
`