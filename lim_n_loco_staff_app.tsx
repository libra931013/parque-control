import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlusCircle,
  Camera,
  Upload,
  Filter,
  FileText,
  Printer,
  ChevronRight,
  ShieldAlert,
  User,
  MapPin,
  Calendar,
  Check,
  RefreshCw,
  Search,
  Maximize2,
  Minimize2,
  X,
  Trash2,
  Edit3,
  Smile,
  Zap,
  Download,
  PhoneCall,
  CheckSquare,
  ArrowRight,
  Layers,
  Wrench,
  ThumbsUp,
  Image as ImageIcon,
  Smartphone,
  HelpCircle,
  Share2,
  ExternalLink,
  Info
} from 'lucide-react';

// --- INITIAL MOCK DATA WITH BASE64 IMAGES & REALISTIC PARK ISSUES ---
const INITIAL_REPORTS = [
  {
    id: 'LL-101',
    worker: 'Armando Pérez',
    area: 'Piscina de Bolas',
    category: 'Limpieza',
    priority: 'Media',
    description: 'Bolas desinfectadas fuera del área acumuladas en el pasillo principal.',
    status: 'Pendiente',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    solutionNote: '',
    photo: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'LL-102',
    worker: 'Paula García',
    area: 'Toboganes y Túneles',
    category: 'Defecto',
    priority: 'Urgente',
    description: 'Red de protección lateral floja en el 2º nivel del tobogán en espiral. Riesgo de caída.',
    status: 'En Proceso',
    timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
    solutionNote: 'Técnico de mantenimiento en camino con bridas y tensores de seguridad.',
    photo: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'LL-103',
    worker: 'David Rubio',
    area: 'Recepción / Cafetería',
    category: 'Limpieza',
    priority: 'Media',
    description: 'Derrame de jugo de fresa en las mesas de la zona de padres cerca del mostrador.',
    status: 'Solucionado',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    solutionNote: 'Limpiado y desinfectado con producto multiusos neutro.',
    photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'LL-104',
    worker: 'Elena Vega',
    area: 'Baños Infantiles',
    category: 'Limpieza',
    priority: 'Urgente',
    description: 'Jabón agotado y suelo muy húmedo cerca del lavabo adaptado.',
    status: 'Solucionado',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    solutionNote: 'Dispensador recargado y suelo secado con mopa anti-deslizante.',
    photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'LL-105',
    worker: 'Armando Pérez',
    area: 'Camas Elásticas',
    category: 'Defecto',
    priority: 'Urgente',
    description: 'Protección acolchada desplazada dejando al descubierto los muelles en la lona #2.',
    status: 'Pendiente',
    timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
    solutionNote: '',
    photo: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80'
  }
];

const PARK_AREAS = [
  { id: 'Piscina de Bolas', name: 'Piscina de Bolas', icon: '🔴', color: 'from-pink-500 to-rose-600' },
  { id: 'Toboganes y Túneles', name: 'Toboganes & Túneles', icon: '🎢', color: 'from-amber-400 to-orange-500' },
  { id: 'Camas Elásticas', name: 'Camas Elásticas', icon: '🤸', color: 'from-purple-500 to-indigo-600' },
  { id: 'Zona Baby / Infantes', name: 'Zona Baby (0-3 años)', icon: '🧸', color: 'from-emerald-400 to-teal-600' },
  { id: 'Zona VR / Simuladores', name: 'Zona VR & Arcadía', icon: '🎮', color: 'from-cyan-400 to-blue-600' },
  { id: 'Recepción / Cafetería', name: 'Cafetería & Padres', icon: '☕', color: 'from-yellow-500 to-amber-700' },
  { id: 'Baños Infantiles', name: 'Baños y Aseos', icon: '🧼', color: 'from-sky-400 to-cyan-600' }
];

const WORKERS = ['Armando Pérez', 'Paula García', 'David Rubio', 'Elena Vega', 'Carlos Mendoza', 'Turno General'];

const QUICK_TEXT_SHORTCUTS = [
  'Bolas fuera de piscina',
  'Líquido derramado',
  'Malla rota / floja',
  'Piso resbaladizo',
  'Juguete roto',
  'Tornillo o pieza suelta',
  'Falta jabón / papel',
  'Protector de foam desplazado'
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | new-report | history | export | apk-guide
  const [reports, setReports] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // --- FORM STATE ---
  const [worker, setWorker] = useState(WORKERS[0]);
  const [selectedArea, setSelectedArea] = useState(PARK_AREAS[0].id);
  const [category, setCategory] = useState('Limpieza'); // Limpieza | Defecto
  const [priority, setPriority] = useState('Media'); // Baja | Media | Urgente
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // --- SOLVE MODAL STATE ---
  const [solveModalId, setSolveModalId] = useState(null);
  const [solutionNoteInput, setSolutionNoteInput] = useState('');

  // --- FILTERS STATE ---
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterArea, setFilterArea] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  // --- IMAGE PREVIEW MODAL ---
  const [modalImage, setModalImage] = useState(null);

  // Hidden File Input Ref
  const fileInputRef = useRef(null);

  // Load / Save Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('limonloco_reports_v3');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        setReports(INITIAL_REPORTS);
      }
    } else {
      setReports(INITIAL_REPORTS);
      localStorage.setItem('limonloco_reports_v3', JSON.stringify(INITIAL_REPORTS));
    }
  }, []);

  const saveReportsToStorage = (newReports) => {
    setReports(newReports);
    localStorage.setItem('limonloco_reports_v3', JSON.stringify(newReports));
  };

  // Add Report
  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Por favor agrega una breve descripción o selecciona un atajo.');
      return;
    }

    const newReport = {
      id: `LL-${Math.floor(100 + Math.random() * 900)}`,
      worker,
      area: selectedArea,
      category,
      priority,
      description,
      status: 'Pendiente',
      timestamp: new Date().toISOString(),
      solutionNote: '',
      photo: photoPreview || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    };

    const updated = [newReport, ...reports];
    saveReportsToStorage(updated);

    // Reset Form
    setDescription('');
    setPhotoPreview(null);
    setSuccessToast(true);

    setTimeout(() => {
      setSuccessToast(false);
      setActiveTab('history');
    }, 1200);
  };

  // Status Change Logic
  const handleUpdateStatus = (id, newStatus) => {
    if (newStatus === 'Solucionado') {
      setSolveModalId(id);
      setSolutionNoteInput('');
      return;
    }

    const updated = reports.map(r => r.id === id ? { ...r, status: newStatus } : r);
    saveReportsToStorage(updated);
  };

  const handleConfirmSolution = () => {
    if (!solveModalId) return;
    const updated = reports.map(r => 
      r.id === solveModalId 
        ? { ...r, status: 'Solucionado', solutionNote: solutionNoteInput.trim() || 'Resuelto correctamente.' } 
        : r
    );
    saveReportsToStorage(updated);
    setSolveModalId(null);
    setSolutionNoteInput('');
  };

  // Delete Handler
  const handleDeleteReport = (id) => {
    if (confirm('¿Eliminar este registro permanentemente?')) {
      const updated = reports.filter(r => r.id !== id);
      saveReportsToStorage(updated);
    }
  };

  // Camera & File Capture Handler
  const handleSimulateCamera = () => {
    setIsCapturingPhoto(true);
    setTimeout(() => {
      const mockPhotos = [
        'https://images.unsplash.com/photo-1566454825481-4e48f80aa4d7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80'
      ];
      setPhotoPreview(mockPhotos[Math.floor(Math.random() * mockPhotos.length)]);
      setIsCapturingPhoto(false);
    }, 700);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Shortcut Click
  const handleAddShortcut = (text) => {
    if (!description) {
      setDescription(text);
    } else {
      setDescription(prev => `${prev}. ${text}`);
    }
  };

  // Filter & Metrics
  const today = new Date().toISOString().split('T')[0];
  const reportsToday = reports.filter(r => r.timestamp.startsWith(today));
  const pendingCount = reports.filter(r => r.status === 'Pendiente').length;
  const inProgressCount = reports.filter(r => r.status === 'En Proceso').length;
  const solvedCount = reports.filter(r => r.status === 'Solucionado').length;
  const urgentCount = reports.filter(r => r.priority === 'Urgente' && r.status !== 'Solucionado').length;

  const filteredReports = reports.filter(r => {
    const matchesCategory = filterCategory === 'Todos' || r.category === filterCategory;
    const matchesStatus = filterStatus === 'Todos' || r.status === filterStatus;
    const matchesArea = filterArea === 'Todas' || r.area === filterArea;
    const matchesSearch = searchQuery === '' || 
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.worker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesArea && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-0 md:p-4 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* MOBILE FRAME WRAPPER */}
      <div className={`w-full ${isFullScreen ? 'max-w-none min-h-screen rounded-none' : 'max-w-md h-[95vh] md:h-[900px] rounded-[36px] border-[6px] border-slate-800'} bg-slate-900 shadow-2xl flex flex-col overflow-hidden relative border-slate-800/80`}>
        
        {/* HEADER */}
        <header className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-slate-950 p-3.5 px-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-950/90 text-amber-400 flex items-center justify-center font-black text-xl shadow-inner border border-amber-400/30">
              🍋
            </div>
            <div>
              <h1 className="text-base font-black leading-none tracking-tight text-slate-950 flex items-center gap-1.5">
                LIMÓN LOCO
                <span className="text-[10px] bg-slate-950 text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Staff App
                </span>
              </h1>
              <p className="text-[11px] text-slate-900/80 font-bold flex items-center gap-1 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-950 animate-pulse"></span>
                Control de Parque Infantil
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('apk-guide')}
              className={`p-2 rounded-xl transition font-bold text-xs flex items-center gap-1 ${
                activeTab === 'apk-guide' 
                  ? 'bg-slate-950 text-amber-300' 
                  : 'text-slate-950 hover:bg-slate-950/10'
              }`}
              title="Convertir a APK"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">APK</span>
            </button>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-slate-950 hover:bg-slate-950/10 rounded-xl transition"
              title={isFullScreen ? 'Vista Marco Móvil' : 'Pantalla Completa'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* MAIN BODY SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 scrollbar-none">
          
          {/* TAB 1: DASHBOARD / RESUMEN */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Active Worker Quick Switch */}
              <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Empleado en Turno:</span>
                    <span className="text-xs font-black text-white">{worker}</span>
                  </div>
                </div>

                <select
                  value={worker}
                  onChange={(e) => setWorker(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-amber-300 font-bold rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-amber-400"
                >
                  {WORKERS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Urgent Notification Banner */}
              {urgentCount > 0 && (
                <div className="bg-gradient-to-r from-rose-500/20 to-red-600/20 border border-red-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-lg shadow-red-500/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-xl text-white font-bold animate-bounce">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-red-300 uppercase tracking-wider">Averías Críticas</h3>
                      <p className="text-xs text-red-200/90 font-medium">
                        {urgentCount} incidencia(s) urgente(s) sin resolver.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setFilterStatus('Pendiente');
                      setActiveTab('history');
                    }}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white font-extrabold px-3 py-1.5 rounded-xl transition shadow-sm"
                  >
                    Atender
                  </button>
                </div>
              )}

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl relative overflow-hidden">
                  <div className="text-slate-400 text-xs font-semibold">Reportes Hoy</div>
                  <div className="text-2xl font-black text-white mt-0.5">{reportsToday.length}</div>
                  <div className="text-[10px] text-amber-400 font-medium mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl relative overflow-hidden">
                  <div className="text-slate-400 text-xs font-semibold">Pendientes</div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">{pendingCount}</div>
                  <div className="text-[10px] text-amber-400/80 font-medium mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Requieren atención
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl relative overflow-hidden">
                  <div className="text-slate-400 text-xs font-semibold">En Solución</div>
                  <div className="text-2xl font-black text-blue-400 mt-0.5">{inProgressCount}</div>
                  <div className="text-[10px] text-blue-400/80 font-medium mt-1 flex items-center gap-1">
                    <Wrench className="w-3 h-3" /> En mantenimiento
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl relative overflow-hidden">
                  <div className="text-slate-400 text-xs font-semibold">Resueltas</div>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">{solvedCount}</div>
                  <div className="text-[10px] text-emerald-400/80 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Parque operativo
                  </div>
                </div>
              </div>

              {/* Park Visual Status by Area */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    Estado por Zonas del Parque
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium">{PARK_AREAS.length} Zonas</span>
                </div>

                <div className="space-y-2">
                  {PARK_AREAS.map(area => {
                    const areaReports = reports.filter(r => r.area === area.id && r.status !== 'Solucionado');
                    const hasUrgent = areaReports.some(r => r.priority === 'Urgente');
                    const hasCleanliness = areaReports.some(r => r.category === 'Limpieza');
                    const hasDefect = areaReports.some(r => r.category === 'Defecto');

                    // Traffic light indicator status
                    let statusBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                    let statusLabel = 'Limpio y OK';
                    let statusDot = 'bg-emerald-400';

                    if (hasUrgent || hasDefect) {
                      statusBg = 'bg-red-500/10 border-red-500/30 text-red-400';
                      statusLabel = 'Defecto / Riesgo';
                      statusDot = 'bg-red-500 animate-pulse';
                    } else if (hasCleanliness) {
                      statusBg = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
                      statusLabel = 'Suciedad Pendiente';
                      statusDot = 'bg-amber-400';
                    }

                    return (
                      <div
                        key={area.id}
                        onClick={() => {
                          setFilterArea(area.id);
                          setActiveTab('history');
                        }}
                        className="flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 border border-slate-700/50 p-3 rounded-2xl cursor-pointer transition group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{area.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition">
                              {area.name}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {areaReports.length === 0 ? (
                                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                                  <Check className="w-3 h-3" /> Sin incidencias
                                </span>
                              ) : (
                                <span>{areaReports.length} problema(s) activos</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${statusBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                            {statusLabel}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Floating Trigger Button */}
              <button
                onClick={() => setActiveTab('new-report')}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black py-4 px-4 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm transition active:scale-[0.98]"
              >
                <PlusCircle className="w-5 h-5 text-slate-950" />
                REPORTAR LIMPIEZA / DEFECTO AHORA
              </button>
            </div>
          )}

          {/* TAB 2: FORMULARIO DE NUEVO REPORTE */}
          {activeTab === 'new-report' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-800/90 border border-slate-700/60 p-4 rounded-2xl">
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  Nuevo Reporte Rápido
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Reporta zonas sucias o averías en segundos para mantener el parque seguro.</p>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-4">
                
                {/* 1. Worker Selector */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-400" />
                    ¿Quién reporta la incidencia?
                  </label>
                  <select
                    value={worker}
                    onChange={(e) => setWorker(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-amber-400 outline-none"
                  >
                    {WORKERS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Visual Area Selection */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    Selecciona el Área del Parque
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PARK_AREAS.map(area => (
                      <button
                        type="button"
                        key={area.id}
                        onClick={() => setSelectedArea(area.id)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                          selectedArea === area.id
                            ? 'bg-amber-400/20 border-amber-400 text-white font-bold shadow-md'
                            : 'bg-slate-900/60 border-slate-700/70 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <span className="text-xl">{area.icon}</span>
                        <span className="text-[11px] leading-tight font-semibold truncate">{area.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Category Selector (Limpieza vs Defecto) */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Tipo de Reporte
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory('Limpieza')}
                      className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-extrabold transition ${
                        category === 'Limpieza'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                          : 'bg-slate-900/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Limpieza / Suciedad
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory('Defecto')}
                      className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-extrabold transition ${
                        category === 'Defecto'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-slate-900/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Defecto / Avería
                    </button>
                  </div>
                </div>

                {/* 4. Priority Selector */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300">Nivel de Prioridad</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Baja', label: 'Baja (Rutina)' },
                      { id: 'Media', label: 'Media (Pronto)' },
                      { id: 'Urgente', label: 'Urgente / Peligro' }
                    ].map(p => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setPriority(p.id)}
                        className={`py-2.5 rounded-xl text-[11px] font-black border transition ${
                          priority === p.id
                            ? p.id === 'Baja' 
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                              : p.id === 'Media' 
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                                : 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                            : 'bg-slate-900/60 border-slate-700/60 text-slate-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Description & Shortcuts */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-2.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-amber-400" />
                    Descripción del problema
                  </label>

                  {/* Text Shortcuts */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Atajos rápidos de texto:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_TEXT_SHORTCUTS.map(sc => (
                        <button
                          type="button"
                          key={sc}
                          onClick={() => handleAddShortcut(sc)}
                          className="text-[10px] bg-slate-900 hover:bg-slate-950 text-slate-300 hover:text-amber-300 border border-slate-700/80 px-2 py-1 rounded-lg transition"
                        >
                          + {sc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Escribe detalles adicionales..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-400 outline-none resize-none"
                  ></textarea>
                </div>

                {/* 6. Photography Capture Section */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-400" />
                    Fotografía de Evidencia
                  </label>

                  {photoPreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700">
                      <img src={photoPreview} alt="Vista previa" className="w-full h-44 object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="absolute top-2 right-2 bg-slate-950/80 text-red-400 p-2 rounded-full backdrop-blur-md hover:bg-slate-950 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-slate-950/80 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1">
                        <Check className="w-3 h-3" /> Foto Adjuntada
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleSimulateCamera}
                        disabled={isCapturingPhoto}
                        className="bg-slate-900 hover:bg-slate-950 border border-slate-700/80 p-3.5 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300 transition group"
                      >
                        {isCapturingPhoto ? (
                          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6 text-amber-400 group-hover:scale-110 transition" />
                        )}
                        <span className="text-[11px] font-bold">
                          {isCapturingPhoto ? 'Capturando...' : 'Tomar Foto'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-900 hover:bg-slate-950 border border-slate-700/80 p-3.5 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300 transition group"
                      >
                        <Upload className="w-6 h-6 text-amber-400 group-hover:scale-110 transition" />
                        <span className="text-[11px] font-bold">Galería</span>
                      </button>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-4 px-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm transition active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  GUARDAR Y PUBLICAR REPORTE
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: REGISTRO E HISTORIAL */}
          {activeTab === 'history' && (
            <div className="space-y-3 animate-fadeIn">
              
              {/* Filter Controls Bar */}
              <div className="bg-slate-800/90 border border-slate-700/60 p-3 rounded-2xl space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por atajo, descripción, trabajador..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Selectors */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 outline-none text-[11px] font-medium"
                  >
                    <option value="Todos">Tipo: Todos</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Defecto">Defecto</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 outline-none text-[11px] font-medium"
                  >
                    <option value="Todos">Estado: Todos</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="En Proceso">En Solución</option>
                    <option value="Solucionado">Solucionados</option>
                  </select>

                  <select
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 outline-none text-[11px] font-medium max-w-[130px] truncate"
                  >
                    <option value="Todas">Zonas: Todas</option>
                    {PARK_AREAS.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>

                  {(filterCategory !== 'Todos' || filterStatus !== 'Todos' || filterArea !== 'Todas' || searchQuery !== '') && (
                    <button
                      onClick={() => {
                        setFilterCategory('Todos');
                        setFilterStatus('Todos');
                        setFilterArea('Todas');
                        setSearchQuery('');
                      }}
                      className="text-amber-400 hover:text-amber-300 underline ml-auto text-[10px] font-bold"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              {/* Counter */}
              <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-medium">
                <span>{filteredReports.length} incidencias encontradas</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  Total: {reports.length}
                </span>
              </div>

              {/* Reports List */}
              {filteredReports.length === 0 ? (
                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
                  <Smile className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-400">Sin incidencias en esta lista</p>
                  <p className="text-[11px] text-slate-500">Prueba cambiando los filtros arriba.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredReports.map(report => (
                    <div
                      key={report.id}
                      className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 space-y-3 relative overflow-hidden shadow-sm"
                    >
                      {/* Top Bar: Code, Time & Priority */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                            {report.id}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Priority Badge */}
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          report.priority === 'Urgente'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                            : report.priority === 'Media'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {report.priority}
                        </span>
                      </div>

                      {/* Area & Description */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            {report.area}
                          </span>
                          <span className={`text-[10px] px-2 py-0.2 rounded font-bold border ${
                            report.category === 'Limpieza'
                              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          }`}>
                            {report.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">{report.description}</p>
                      </div>

                      {/* Solution Note if solved */}
                      {report.solutionNote && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-[11px] text-emerald-300 flex items-start gap-1.5">
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">Solución aplicada:</span>
                            {report.solutionNote}
                          </div>
                        </div>
                      )}

                      {/* Photo Thumbnail & Worker Name */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2.5">
                          {report.photo && (
                            <div className="relative group cursor-pointer" onClick={() => setModalImage(report.photo)}>
                              <img
                                src={report.photo}
                                alt="Evidencia"
                                className="w-12 h-12 object-cover rounded-xl border border-slate-700 hover:scale-105 transition"
                              />
                              <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <ImageIcon className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400">
                            <span className="block text-[10px] text-slate-500">Reportó:</span>
                            <span className="font-bold text-slate-300">{report.worker}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg transition"
                          title="Eliminar reporte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Action Buttons to Update Status */}
                      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Acción:</span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(report.id, 'Pendiente')}
                            className={`text-[10px] font-black px-2.5 py-1 rounded-xl transition ${
                              report.status === 'Pendiente'
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            Pendiente
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(report.id, 'En Proceso')}
                            className={`text-[10px] font-black px-2.5 py-1 rounded-xl transition ${
                              report.status === 'En Proceso'
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            En Solución
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(report.id, 'Solucionado')}
                            className={`text-[10px] font-black px-2.5 py-1 rounded-xl transition ${
                              report.status === 'Solucionado'
                                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            Solucionado
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REPORTE DIARIO E IMPRESIÓN */}
          {activeTab === 'export' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-800/90 border border-slate-700/60 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Informe de Control Diario
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Listo para revisión de gerencia o impresión.</p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 p-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir / PDF
                </button>
              </div>

              {/* Printable Document Box */}
              <div id="printable-area" className="bg-white text-slate-900 p-6 rounded-3xl space-y-4 shadow-xl border border-slate-200">
                {/* Printable Header */}
                <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
                  <div>
                    <h1 className="text-base font-black text-slate-900 tracking-tight">INFORME DIARIO PARQUE INFANTIL - LIMÓN LOCO</h1>
                    <p className="text-xs text-slate-600 font-medium">Control de Limpieza, Mantenimiento e Higiene</p>
                  </div>
                  <div className="text-right text-xs text-slate-700 font-semibold">
                    <div>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div className="text-[10px] text-slate-500 font-normal">Estado: Completo</div>
                  </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-4 gap-2 text-center bg-slate-100 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <span className="block text-[9px] text-slate-500 font-extrabold uppercase">Total Incidencias</span>
                    <span className="text-base font-black text-slate-900">{reports.length}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-500 font-extrabold uppercase">Pendientes</span>
                    <span className="text-base font-black text-amber-600">{pendingCount}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-500 font-extrabold uppercase">En Mantenimiento</span>
                    <span className="text-base font-black text-blue-600">{inProgressCount}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-500 font-extrabold uppercase">Solucionadas</span>
                    <span className="text-base font-black text-emerald-600">{solvedCount}</span>
                  </div>
                </div>

                {/* Incidents Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Desglose por Incidencia y Trabajador</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-200 text-slate-700 bg-slate-50">
                          <th className="py-2 px-1 font-extrabold">Hora</th>
                          <th className="py-2 px-1 font-extrabold">Área</th>
                          <th className="py-2 px-1 font-extrabold">Tipo</th>
                          <th className="py-2 px-1 font-extrabold">Descripción</th>
                          <th className="py-2 px-1 font-extrabold">Reportó</th>
                          <th className="py-2 px-1 font-extrabold">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {reports.map(r => (
                          <tr key={r.id}>
                            <td className="py-2 px-1 font-semibold text-slate-600 whitespace-nowrap">
                              {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-2 px-1 font-bold text-slate-900">{r.area}</td>
                            <td className="py-2 px-1">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                r.category === 'Limpieza' ? 'bg-cyan-100 text-cyan-900' : 'bg-amber-100 text-amber-900'
                              }`}>
                                {r.category}
                              </span>
                            </td>
                            <td className="py-2 px-1 text-slate-700 max-w-[140px] truncate">{r.description}</td>
                            <td className="py-2 px-1 text-slate-600 font-medium">{r.worker}</td>
                            <td className="py-2 px-1 font-extrabold">
                              <span className={`${
                                r.status === 'Solucionado' ? 'text-emerald-700' : r.status === 'En Proceso' ? 'text-blue-700' : 'text-amber-700'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Signatures */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-[11px] text-slate-600 border-t border-slate-200 mt-6">
                  <div className="border-t border-slate-400 pt-1 text-center font-semibold">
                    Firma Responsable Limpieza / Turno
                  </div>
                  <div className="border-t border-slate-400 pt-1 text-center font-semibold">
                    Firma Gerencia / Mantenimiento
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GUÍA PASO A PASO PARA CONVERTIR EN APK */}
          {activeTab === 'apk-guide' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 p-4 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-black">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">Convertir esta Web en APK para Android</h2>
                    <p className="text-xs text-amber-200/90 font-medium">Guía gratuita para instalar en móviles de los trabajadores.</p>
                  </div>
                </div>
              </div>

              {/* Option 1: Quick Web APK Generator */}
              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">1</span>
                  Método Gratuito: PWABuilder (Recomendado)
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  <strong>PWABuilder.com</strong> es la herramienta oficial desarrollada por Microsoft para transformar aplicaciones web en archivos **.apk** listos para Android sin programar nada.
                </p>

                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
                  <li>Publica o aloja este archivo web en un servidor (por ejemplo Netlify, Vercel o GitHub Pages gratis).</li>
                  <li>Entra en la web <strong className="text-amber-300">PWABuilder.com</strong> desde tu navegador.</li>
                  <li>Ingresa la URL de tu aplicación publicada y haz clic en <strong>Start</strong>.</li>
                  <li>Presiona el botón <strong className="text-emerald-400">"Build My APK"</strong>.</li>
                  <li>¡Descarga el archivo <strong>.apk</strong> e instálalo directamente en los móviles Android del parque!</li>
                </ol>

                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition shadow-md w-full justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir PWABuilder.com
                </a>
              </div>

              {/* Option 2: Instant PWA Install on Android */}
              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-black text-[10px]">2</span>
                  Instalación Directa Sin APK (PWA)
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  No necesitas compilar si no quieres. Los trabajadores pueden tener el icono de la app en su pantalla de inicio como una aplicación nativa:
                </p>

                <ul className="text-xs text-slate-300 space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Abre el enlace de la app en Chrome en el móvil Android.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pulsa el menú de 3 puntos arriba a la derecha.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Selecciona <strong>"Añadir a la pantalla de inicio"</strong> o <strong>"Instalar aplicación"</strong>.</span>
                  </li>
                </ul>
              </div>

              {/* Option 3: Bubblewrap CLI */}
              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-400 text-slate-950 flex items-center justify-center font-black text-[10px]">3</span>
                  Bubblewrap CLI (Para Desarrolladores)
                </div>
                <p className="text-[11px] text-slate-400">
                  Si deseas generar el APK firmado desde tu consola usando Node.js:
                </p>
                <div className="bg-slate-950 text-amber-300 p-2.5 rounded-xl text-[11px] font-mono border border-slate-800 overflow-x-auto">
                  npm i -g @bubblewrap/cli<br/>
                  bubblewrap init --manifest https://tu-pwa.com/manifest.json<br/>
                  bubblewrap build
                </div>
              </div>
            </div>
          )}

        </main>

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-1.5 flex items-center justify-around absolute bottom-0 left-0 right-0 z-30">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-2xl text-[10px] font-extrabold transition ${
              activeTab === 'dashboard' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-5 h-5" />
            Resumen
          </button>

          <button
            onClick={() => setActiveTab('new-report')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-2xl text-[10px] font-extrabold transition ${
              activeTab === 'new-report' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            Reportar
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-2xl text-[10px] font-extrabold transition relative ${
              activeTab === 'history' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-5 h-5" />
            Historial
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-2xl text-[10px] font-extrabold transition ${
              activeTab === 'export' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            Informe
          </button>

          <button
            onClick={() => setActiveTab('apk-guide')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-2xl text-[10px] font-extrabold transition ${
              activeTab === 'apk-guide' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            APK
          </button>
        </nav>

        {/* MODAL SOLVE INCIDENT NOTE */}
        {solveModalId && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-xs w-full space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Marcar como Solucionado
                </h3>
                <button onClick={() => setSolveModalId(null)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-medium">Añade una nota breve de cómo se solucionó:</p>
              <textarea
                rows={3}
                value={solutionNoteInput}
                onChange={(e) => setSolutionNoteInput(e.target.value)}
                placeholder="Ej. Se ajustó la red con bridas nuevas / Limpiado con desinfectante..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 resize-none"
              ></textarea>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setSolveModalId(null)}
                  className="w-1/2 bg-slate-800 text-slate-300 text-xs font-bold py-2.5 rounded-xl hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSolution}
                  className="w-1/2 bg-emerald-500 text-slate-950 text-xs font-black py-2.5 rounded-xl hover:bg-emerald-400 transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FULL IMAGE VIEW */}
        {modalImage && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative max-w-sm w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-3 right-3 bg-slate-950/80 text-white p-2 rounded-full z-10 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={modalImage} alt="Fotografía evidencia" className="w-full h-auto max-h-[70vh] object-contain bg-black" />
              <div className="p-3 bg-slate-900 text-center border-t border-slate-800">
                <span className="text-xs text-slate-300 font-bold">Evidencia gráfica del reporte</span>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS TOAST */}
        {successToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            ¡Reporte guardado con éxito!
          </div>
        )}

      </div>
    </div>
  );
}