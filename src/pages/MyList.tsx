import { useAppContext } from '../context/AppContext';
import { ContentCard } from '../components/ui/ContentCard';

export function MyList() {
  const { myList } = useAppContext();

  return (
    <div>
      <div className="flex justify-between items-center mb-[15px]">
        <span className="text-[18px] font-[700] text-white">Minha Lista ({myList.length})</span>
      </div>
      
      {myList.length === 0 ? (
        <div className="text-center py-10 text-muted">Sua lista está vazia.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[15px]">
          {myList.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
