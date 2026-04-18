import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentItem } from '../../data/mockData';
import { cn } from '../../lib/utils';

export interface ContentCardProps {
  key?: React.Key;
  item: ContentItem;
  className?: string;
}

export function ContentCard({ item, className }: ContentCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/post/${item.id}`)}
      className={cn(
        "relative rounded-[8px] overflow-hidden bg-dark-surface border border-border cursor-pointer flex flex-col group hover:border-muted transition-colors",
        className
      )}
    >
      <div className="absolute top-[8px] right-[8px] bg-black/70 text-primary text-[9px] font-bold px-[6px] py-[2px] rounded-[4px] z-10 uppercase">
        {item.rating > 8.0 ? '4K' : 'HD'}
      </div>
      
      <img 
        src={item.coverUrl || undefined} 
        alt={item.title}
        className="w-full h-[180px] object-cover bg-[#21262d]"
        referrerPolicy="no-referrer"
      />

      <div className="p-[10px]">
        <h3 className="text-[13px] font-[600] text-white whitespace-nowrap overflow-hidden text-ellipsis mb-1 block">
          {item.title}
        </h3>
        <div className="flex gap-[8px] text-[11px] text-muted items-center">
          <span>{item.year === Math.floor(item.year) ? 'Ep 01' : 'Filme'}</span>
          <span style={{ color: item.type === 'anime' ? '#00ff88' : '' }}>
            {item.type === 'anime' ? 'Dublado' : 'Legendado'}
          </span>
        </div>
      </div>
    </div>
  );
}
