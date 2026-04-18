import { useAppContext } from '../context/AppContext';
import { ContentCard } from '../components/ui/ContentCard';
import { useSearchParams } from 'react-router-dom';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { catalog } = useAppContext();
  
  const results = catalog.filter((item) => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center mb-[15px] gap-2">
        <span className="text-[18px] font-[700] text-white">Resultados para:</span>
        <span className="text-[18px] text-primary">"{query}"</span>
      </div>
      
      {results.length === 0 ? (
        <div className="text-center py-10 text-muted">Nenhum resultado.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[15px]">
          {results.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
