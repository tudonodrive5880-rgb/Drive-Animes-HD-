import { useNavigate } from 'react-router-dom';
import { ContentItem } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';

interface HeroProps {
  item: ContentItem;
}

export function Hero({ item }: HeroProps) {
  const navigate = useNavigate();
  const { isInMyList, addToMyList, removeFromMyList } = useAppContext();
  
  const isSaved = isInMyList(item.id);

  const handleToggleList = () => {
    if (isSaved) removeFromMyList(item.id);
    else addToMyList(item);
  };

  return (
    <section className="relative w-full h-[280px] rounded-[12px] overflow-hidden mb-[30px] border border-border flex flex-col justify-center p-[40px]">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={item.heroUrl || undefined} 
          alt={item.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[500px]">
        <div className="bg-primary text-white px-2.5 py-1 rounded-[4px] text-[10px] font-bold w-fit mb-[10px]">DESTAQUE DA SEMANA</div>
        <h1 className="text-[36px] font-[800] text-white m-0 tracking-tight leading-tight mb-[10px] line-clamp-1">
          {item.title}
        </h1>
        <p className="text-[14px] text-muted max-w-[400px] mb-[20px] line-clamp-2">
          {item.description} Dublado e Legendado em 4K.
        </p>
        <div className="flex items-center gap-[10px]">
          <button
            onClick={() => navigate(`/post/${item.id}`)}
            className="px-[24px] py-[10px] bg-primary hover:bg-primary-hover text-white text-[14px] font-[600] rounded-[6px] transition-colors border-none cursor-pointer"
          >
            Acessar Postagem
          </button>
          <button 
            onClick={handleToggleList}
            className="px-[24px] py-[10px] bg-white/10 hover:bg-white/20 text-white text-[14px] font-[600] rounded-[6px] backdrop-blur-[5px] transition-colors border-none cursor-pointer"
          >
            {isSaved ? 'Adicionado' : '+ Minha Lista'}
          </button>
        </div>
      </div>
    </section>
  );
}
