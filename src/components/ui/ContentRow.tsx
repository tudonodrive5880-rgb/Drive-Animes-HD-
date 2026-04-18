import { ContentItem } from '../../data/mockData';
import { ContentCard } from './ContentCard';

interface ContentRowProps {
  title: string;
  items: ContentItem[];
}

export function ContentRow({ title, items }: ContentRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-[30px]">
      <div className="flex justify-between items-center mb-[15px]">
        <span className="text-[18px] font-[700] text-white">{title}</span>
        <a href="#" className="text-primary text-[13px] decoration-auto hover:underline">Ver todos</a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[15px]">
        {items.map(item => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
