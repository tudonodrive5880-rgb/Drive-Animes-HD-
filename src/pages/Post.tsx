import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, HardDrive, Monitor, Mic, FileText, Download, Check, ShieldCheck, FileArchive, PlaySquare, ListVideo, Play, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import { ContentRow } from '../components/ui/ContentRow';

export function Post() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { catalog, addToHistory, isInMyList, addToMyList, removeFromMyList } = useAppContext();
  
  const item = catalog.find((i) => i.id === id);
  const [isSaved, setIsSaved] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isPlayingDrive, setIsPlayingDrive] = useState(false);
  const [inAppUrl, setInAppUrl] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      addToHistory(item);
      setIsSaved(isInMyList(item.id));
      setCurrentEpisode(1); // reset when changing posts
      setIsPlayingDrive(false);
    }
  }, [id, item, isInMyList, addToHistory]);

  // Also reset playing state when changing episodes
  useEffect(() => {
    setIsPlayingDrive(false);
  }, [currentEpisode]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[60px]">
        <h2 className="text-2xl text-muted">Postagem não encontrada.</h2>
      </div>
    );
  }

  const handleToggleList = () => {
    if (isSaved) {
      removeFromMyList(item.id);
      setIsSaved(false);
    } else {
      addToMyList(item);
      setIsSaved(true);
    }
  };

  const getQuality = () => item.rating > 8.0 ? '4K WEB-DL / Bluray' : '1080p WEB-DL';
  const getAudio = () => item.type === 'anime' ? 'Português (Brasil) / Japonês' : 'Português / Inglês';
  const getSize = () => item.type === 'series' || item.type === 'anime' ? 'Média ~800 MB/Episódio' : (item.rating > 8.0 ? '~3.5 GB' : '~1.8 GB');

  const isEpisodic = item.type === 'anime' || item.type === 'series';

  // Find the label for the currently playing episode
  let currentEpisodeLabel = isEpisodic ? `Episódio ${currentEpisode.toString().padStart(2, '0')}` : 'Filme Completo';
  let currentDriveUrl = item.videoUrl;
  let currentUsersDriveUrl = '';
  
  if (item.episodes && item.episodes.length > 0) {
     const epItem = item.episodes.find(e => e.epNumber === currentEpisode);
     if (epItem) {
        currentEpisodeLabel = epItem.epLabel;
        currentDriveUrl = epItem.driveUrl || '';
        currentUsersDriveUrl = epItem.usersDriveUrl || '';
     }
  }

  return (
    <div className="pb-10">
      {/* Background Hero Info */}
      <div className="w-full h-[35vh] relative -mt-[30px] -mx-[30px] md:-mx-[30px] !w-[100vw] md:!w-[calc(100vw-220px)] overflow-hidden">
        <img 
          src={item.heroUrl || undefined} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-20 blur-[2px]" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-[80px] left-[30px] bg-dark-surface/50 hover:bg-primary border border-border p-2 rounded-full transition-colors flex items-center justify-center z-20"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-0 relative z-10 -mt-[15vh]">
        <div className="flex flex-col md:flex-row gap-[30px]">
          
          {/* Sidebar / Poster */}
          <div className="w-full md:w-[260px] shrink-0">
            <div className="bg-dark-surface border border-border rounded-[10px] overflow-hidden shadow-2xl">
              <img 
                src={item.coverUrl || undefined} 
                alt={item.title} 
                className="w-full h-auto aspect-[2/3] object-cover" 
                referrerPolicy="no-referrer"
              />
              <div className="p-4 flex flex-col gap-2">
                 <button 
                  onClick={handleToggleList}
                  className={cn("w-full py-2.5 rounded-[6px] text-[13px] font-bold flex flex-row items-center justify-center gap-2 transition-colors border", isSaved ? "bg-primary/10 border-primary text-primary" : "bg-white/10 hover:bg-white/20 border-transparent text-white")}
                 >
                   {isSaved ? <Check size={16} /> : <FileText size={16} />}
                   {isSaved ? 'Na sua Biblioteca' : 'Salvar Favorito'}
                 </button>
              </div>
            </div>
          </div>

          {/* Post Details & Downwload Info */}
          <div className="flex-1 text-[#c9d1d9] min-w-0">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                 <span className="bg-primary text-white text-[10px] uppercase font-bold py-1 px-2 rounded">
                    Drive Animes {item.rating > 8.0 ? '4K' : 'HD'}
                 </span>
                 <span className="bg-dark-surface border border-border text-muted text-[10px] uppercase font-bold py-1 px-2 rounded">
                    Livre de Anúncios
                 </span>
              </div>
              <h1 className="text-[28px] md:text-[40px] font-extrabold text-white leading-tight tracking-tight mb-2">
                {item.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted font-medium mb-4">
                <span>Lançamento: {item.year}</span>
                <span>•</span>
                <span className="uppercase">{item.type}</span>
                <span>•</span>
                <span>Nota: <strong className="text-primary">{item.rating}/10</strong></span>
                <span>•</span>
                <span>Gêneros: <strong className="text-white">{item.genre.join(', ')}</strong></span>
              </div>
              <p className="text-[14px] leading-relaxed w-full text-[#8b949e]">
                {item.description}
              </p>
            </div>

            {/* PLAYER GOOGLE DRIVE SECTION */}
            {currentDriveUrl ? (
              <>
                <h3 className="text-[18px] font-bold text-white mb-4 border-b border-border pb-2 flex items-center gap-2 mt-8">
                   <PlaySquare size={20} className="text-primary" /> Assistir Online (Player Drive)
                </h3>
                
                {/* Google Drive iframe player wrapper */}
                <div className="w-full aspect-video bg-black rounded-[8px] overflow-hidden border border-border relative mb-6 shadow-xl group/player flex items-center justify-center">
                  {!isPlayingDrive ? (
                    <>
                      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 to-transparent z-30 flex items-center justify-between opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 pointer-events-none">
                         <div className="flex items-center gap-3">
                            <div className="bg-[#0061FF] w-7 h-7 rounded-[4px] shrink-0 flex items-center justify-center">
                               <Play size={14} fill="white" className="text-white" />
                            </div>
                            <span className="text-white font-medium text-[13px] truncate drop-shadow-md">
                              {item.title} - {currentEpisodeLabel} (HD).mp4
                            </span>
                         </div>
                      </div>
                      
                      {/* Blurred Background with Dark Overlay */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden cursor-pointer" onClick={() => setIsPlayingDrive(true)}>
                        <img
                          src={item.heroUrl || undefined}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover blur-[8px] scale-110 opacity-70 transition-transform duration-700 group-hover/player:scale-[1.12]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 to-[#0d1117]/30 z-10" />
                      </div>

                      {/* Prominent Play Button */}
                      <button 
                        onClick={() => setIsPlayingDrive(true)}
                        className="relative z-20 w-[90px] h-[90px] bg-[#0061FF] hover:bg-[#0052cc] hover:scale-110 transition-all duration-300 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,97,255,0.6)] cursor-pointer border-none group-hover/player:shadow-[0_0_60px_rgba(0,97,255,0.8)]"
                      >
                        <Play size={40} fill="white" className="text-white ml-2" />
                      </button>
                    </>
                  ) : (
                    <iframe
                      title="Google Drive Player"
                      src={currentDriveUrl || undefined}
                      className="w-full h-full border-none"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="w-full aspect-video bg-dark-surface border border-border rounded-[8px] flex flex-col items-center justify-center mb-6 mt-8 shadow-xl p-6 text-center">
                <Monitor size={48} className="text-muted mb-4" />
                <h3 className="text-[18px] font-bold text-white mb-2">Player Indisponível</h3>
                <p className="text-muted text-[14px]">Esta postagem não possui vídeo no Google Drive. Obtenha o arquivo através dos links de download abaixo.</p>
              </div>
            )}

            {/* EPISODES SELECTOR */}
            {isEpisodic && item.episodes && item.episodes.length > 0 && (
              <div className="mb-8 bg-dark-surface border border-border rounded-[8px] p-4">
                <h4 className="text-[14px] font-bold text-white mb-3 flex items-center gap-2">
                   <ListVideo size={16} className="text-muted" /> Selecionar Episódio
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2">
                   {item.episodes.map(ep => (
                     <button
                       key={ep.epNumber}
                       onClick={() => setCurrentEpisode(ep.epNumber as number)}
                       className={cn(
                         "px-2 py-2 text-[12px] font-medium rounded border transition-colors truncate",
                         currentEpisode === ep.epNumber
                           ? "bg-primary border-primary text-white"
                           : "bg-dark-bg border-border text-muted hover:bg-white/10 hover:text-white hover:border-muted"
                       )}
                       title={ep.epLabel}
                     >
                       {ep.epLabel}
                     </button>
                   ))}
                </div>
              </div>
            )}

            {/* If it's supposed to be episodic but doesn't have multiple Drive Links mapped */}
            {isEpisodic && (!item.episodes || item.episodes.length === 0) && (
              <div className="mb-8 bg-dark-surface border border-border rounded-[8px] p-4">
                <h4 className="text-[14px] font-bold text-white mb-3 flex items-center gap-2">
                   <ListVideo size={16} className="text-muted" /> Arquivo Único (Download Em Lote)
                </h4>
                <p className="text-muted text-[13px]">Esta postagem contém um diretório único ou não listou os episódios separadamente. Acesse os downloads abaixo para obter os arquivos.</p>
              </div>
            )}

            {/* Technical Info Grid */}
            <h3 className="text-[16px] font-bold text-white mb-3 flex items-center gap-2 mt-8">
               <ShieldCheck size={18} className="text-primary" /> Informações do Arquivo
            </h3>
            <div className="bg-dark-surface border border-border rounded-[8px] p-[20px] mb-8 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[13px]">
               <div className="flex items-start gap-3">
                 <Monitor size={16} className="text-muted mt-0.5" />
                 <div><strong className="text-white block mb-0.5">Qualidade de Vídeo</strong>{getQuality()}</div>
               </div>
               <div className="flex items-start gap-3">
                 <Mic size={16} className="text-muted mt-0.5" />
                 <div><strong className="text-white block mb-0.5">Áudio / Idioma</strong>{getAudio()}</div>
               </div>
               <div className="flex items-start gap-3">
                 <FileText size={16} className="text-muted mt-0.5" />
                 <div><strong className="text-white block mb-0.5">Legenda</strong>Inclusa (Softsub PT-BR)</div>
               </div>
               <div className="flex items-start gap-3">
                 <FileArchive size={16} className="text-muted mt-0.5" />
                 <div><strong className="text-white block mb-0.5">Formato e Tamanho</strong>MKV / MP4 - {getSize()}</div>
               </div>
            </div>

            {/* Download Links organized like a real Warez/Drive site */}
            <h3 className="text-[18px] font-bold text-white mb-4 border-b border-border pb-2 flex items-center gap-2">
               <Download size={20} className="text-primary" /> Links de Download ({isEpisodic ? 'Pastas Completas' : 'Filme Direto'})
            </h3>
            
            <div className="flex flex-col gap-3 mb-12">
               
               {/* Option 1: Google Drive */}
               {currentDriveUrl && (
                 <div className="bg-dark-surface border border-border rounded-[8px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#0061FF]/50 transition-colors">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                       <div className="w-[45px] h-[45px] rounded-lg bg-[#0061FF]/10 text-[#0061FF] flex items-center justify-center shrink-0 border border-[#0061FF]/20">
                          <HardDrive size={24} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[15px] font-bold text-white flex items-center">
                            Google Drive 
                            <span className="bg-[#0061FF] text-white text-[9px] px-1.5 py-0.5 rounded ml-2 font-black uppercase">Recomendado</span>
                          </span>
                          <span className="text-[12px] text-muted mt-0.5">{getQuality()} • Dual Áudio • Sem Limites</span>
                       </div>
                    </div>
                    <button onClick={() => setInAppUrl(currentDriveUrl.replace('/preview', '/view'))} className="w-full sm:w-auto px-6 py-2.5 bg-[#0061FF] hover:bg-[#0052cc] text-white text-[13px] font-bold rounded-[6px] transition-colors flex items-center justify-center gap-2 border-none cursor-pointer">
                      <Download size={16} /> Fazer Download
                    </button>
                 </div>
               )}

               {/* Option: UsersDrive */}
               {currentUsersDriveUrl && (
                 <div className="bg-dark-surface border border-border rounded-[8px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#10b759]/50 transition-colors">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                       <div className="w-[45px] h-[45px] rounded-lg bg-[#10b759]/10 text-[#10b759] flex items-center justify-center shrink-0 border border-[#10b759]/20">
                          <Download size={24} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[15px] font-bold text-white flex items-center">
                            UsersDrive 
                            {!currentDriveUrl && <span className="bg-[#10b759] text-white text-[9px] px-1.5 py-0.5 rounded ml-2 font-black uppercase">Disponível</span>}
                          </span>
                          <span className="text-[12px] text-muted mt-0.5">{getQuality()} • Download Direto</span>
                       </div>
                    </div>
                    <button onClick={() => setInAppUrl(currentUsersDriveUrl)} className="w-full sm:w-auto px-6 py-2.5 bg-[#10b759] hover:bg-[#0e9f4d] text-white text-[13px] font-bold rounded-[6px] transition-colors flex items-center justify-center gap-2 border-none cursor-pointer">
                      <Download size={16} /> Abrir no UsersDrive
                    </button>
                 </div>
               )}

               {/* Option 2: Mega (Placeholder) */}
               <div className="bg-dark-surface border border-border rounded-[8px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#D92521]/50 transition-colors">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                     <div className="w-[45px] h-[45px] rounded-lg bg-[#D92521]/10 text-[#D92521] flex items-center justify-center shrink-0 border border-[#D92521]/20">
                        <span className="font-black text-xl leading-none">M</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-white">MEGA</span>
                        <span className="text-[12px] text-muted mt-0.5">{getQuality()} • Dual Áudio</span>
                     </div>
                  </div>
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-dark-bg border border-border hover:bg-white/5 text-[#c9d1d9] text-[13px] font-bold rounded-[6px] transition-colors flex items-center justify-center gap-2">
                    <Download size={16} /> Abrir no MEGA
                  </button>
               </div>

               {/* Option 3: MediaFire */}
               <div className="bg-dark-surface border border-border rounded-[8px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#1299F3]/50 transition-colors">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                     <div className="w-[45px] h-[45px] rounded-lg bg-[#1299F3]/10 text-[#1299F3] flex items-center justify-center shrink-0 border border-[#1299F3]/20">
                        <FileArchive size={20} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-white">MediaFire</span>
                        <span className="text-[12px] text-muted mt-0.5">{getQuality()} • Compactado ZIP/RAR</span>
                     </div>
                  </div>
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-dark-bg border border-border hover:bg-white/5 text-[#c9d1d9] text-[13px] font-bold rounded-[6px] transition-colors flex items-center justify-center gap-2">
                    <Download size={16} /> Abrir MediaFire
                  </button>
               </div>
            </div>

          </div>
        </div>

        {/* Similar Posts */}
        <div className="mt-8 border-t border-border pt-8">
          <ContentRow title="Outras Postagens Relacionadas" items={catalog.filter(i => i.id !== item.id && i.type === item.type).slice(0, 12)} />
        </div>
      </div>

      {/* In-App Browser Modal (Prevents exiting the APK) */}
      {inAppUrl && (
        <div className="fixed inset-0 z-[999] bg-dark-bg flex flex-col">
          {/* Header */}
          <div className="h-[60px] bg-dark-surface border-b border-border flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                 <Download size={16} className="text-white" />
               </div>
               <div>
                 <h3 className="text-white font-bold text-[14px]">Navegador Interno</h3>
                 <p className="text-muted text-[11px] truncate max-w-[200px] sm:max-w-[400px]">Navegação segura. O download iniciará no app.</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={inAppUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-muted hover:text-white mr-4 no-underline flex items-center gap-1">
                Abrir Externamente (Cópia)
              </a>
              <button 
                onClick={() => setInAppUrl(null)}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white border-none cursor-pointer"
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          {/* Iframe Content */}
          <div className="flex-1 bg-white relative">
            <iframe 
              src={inAppUrl} 
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
              allow="fullscreen"
            />
          </div>
        </div>
      )}
    </div>
  );
}
