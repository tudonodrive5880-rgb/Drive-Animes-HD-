import { Hero } from '../components/ui/Hero';
import { ContentRow } from '../components/ui/ContentRow';
import { ContentCard } from '../components/ui/ContentCard';
import { useAppContext } from '../context/AppContext';

export function Home() {
  const { catalog, isLoading } = useAppContext();

  const featured = catalog.find((i) => i.featured);
  
  const animes = catalog.filter((i) => i.type === 'anime');
  const movies = catalog.filter((i) => i.type === 'movie');
  const series = catalog.filter((i) => i.type === 'series');
  
  const emAlta = catalog.slice(2, 8); 
  const lancamentos = catalog.slice(10, 16);
  
  if (isLoading) {
    return <div className="text-center py-20 text-muted">Carregando catálogo do Drive Animes HD...</div>;
  }

  return (
    <div>
      {/* Featured Header */}
      {featured ? <Hero item={featured} /> : catalog[0] ? <Hero item={catalog[0]} /> : null}
      
      {/* Quick Rows */}
      {lancamentos.length > 0 && <ContentRow title="Novos Episódios de Animes" items={lancamentos} />}
      {movies.length > 0 && <ContentRow title="Filmes Recomendados" items={movies.slice(0, 6)} />}
      {emAlta.length > 0 && <ContentRow title="Em Alta no Drive Animes HD" items={emAlta} />}
      {series.length > 0 && <ContentRow title="Maratonar Séries" items={series.slice(0, 6)} />}

      {/* Massive All Posts Section */}
      <section className="mt-[40px] pt-[30px] border-t border-border">
        <div className="flex justify-between items-center mb-[20px]">
          <span className="text-[20px] font-[800] text-white">Todas as Postagens (Página Inicial)</span>
        </div>
        
        {/* Render a large grid of recent additions (e.g., 50 mixed items) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[15px]">
          {catalog.slice(0, 50).map(item => ( // Using slice(0, 50) to show a huge list of current available fake items
            <ContentCard key={item.id} item={item} />
          ))}
        </div>

        {/* Fake pagination / load more */}
        <div className="mt-[40px] pb-[20px] flex justify-center">
           <button className="px-[30px] py-[12px] bg-dark-surface hover:bg-white/5 border border-border text-white text-[14px] font-[700] rounded-[6px] transition-colors">
              Carregar Mais Postagens na Lista...
           </button>
        </div>
      </section>
    </div>
  );
}
