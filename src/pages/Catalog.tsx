import { useParams } from 'react-router-dom';
import { ContentType } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { ContentCard } from '../components/ui/ContentCard';

export function Catalog() {
  const { type } = useParams<{ type: ContentType }>();
  const { catalog } = useAppContext();
  
  let items = catalog;
  let title = 'Catálogo Completo';
  
  if (type) {
    items = catalog.filter(i => i.type === type);
    if (type === 'anime') title = 'Animes';
    if (type === 'movie') title = 'Filmes';
    if (type === 'series') title = 'Séries';
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-[15px]">
        <span className="text-[18px] font-[700] text-white">{title} ({items.length})</span>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-10 text-muted">Nenhum título encontrado.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[15px]">
          {items.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
