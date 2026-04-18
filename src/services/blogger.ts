import { ContentItem, ContentType, EpisodeInfo } from '../data/mockData';

export async function fetchBloggerPosts(): Promise<ContentItem[]> {
  return new Promise((resolve) => {
    // Generate a unique callback function name
    const callbackName = 'bloggerCallback_' + Math.round(1000000 * Math.random());
    
    // Set a timeout to prevent hanging forever if script fails silently
    const timeoutId = setTimeout(() => {
      cleanup();
      console.error("Blogger JSONP request timed out.");
      resolve([]);
    }, 10000); // 10 seconds

    const cleanup = () => {
      if ((window as any)[callbackName]) {
        delete (window as any)[callbackName];
      }
      const scriptEle = document.getElementById(callbackName);
      if (scriptEle) {
        scriptEle.remove();
      }
    };

    // Define the global callback function Blogger will trigger
    (window as any)[callbackName] = function(data: any) {
      clearTimeout(timeoutId);
      cleanup();

      if (!data.feed || !data.feed.entry) {
        resolve([]);
        return;
      }

      const items = data.feed.entry.map((entry: any, index: number): ContentItem => {
        const htmlContent = entry.content?.$t || '';
        
        // Extract raw text for description
        const tmp = document.createElement('div');
        tmp.innerHTML = htmlContent;
        
        // Try to find the synopsis part
        const ps = Array.from(tmp.querySelectorAll('p'));
        let description = ps.length > 1 ? ps[1].textContent : tmp.textContent;
        description = (description || '').replace(/\s+/g, ' ').substring(0, 300).trim() + '...';

        // Find all Google Drive and UsersDrive links
        const episodeList: EpisodeInfo[] = [];
        const anchors = tmp.querySelectorAll('a');
        
        anchors.forEach((a) => {
          const href = a.href || '';
          const driveMatch = href.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
          const usersDriveMatch = href.match(/https:\/\/usersdrive\.com\/[a-zA-Z0-9_-]+/) || href.includes('usersdrive.com');

          if (driveMatch || usersDriveMatch) {
            let labelText = a.textContent?.trim() || '';
            labelText = labelText.replace(/download/i, '').trim();
            if (!labelText) labelText = `Episódio ${episodeList.length + 1}`;

            let ep = episodeList.find(e => e.epLabel === labelText);
            if (!ep) {
                ep = {
                    epNumber: episodeList.length + 1,
                    epLabel: labelText,
                };
                episodeList.push(ep);
            }

            if (driveMatch && !ep.driveUrl) {
                ep.driveUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
            }
            if (usersDriveMatch && !ep.usersDriveUrl) {
                ep.usersDriveUrl = href;
            }
          }
        });

        const firstEpWithVideo = episodeList.find(e => e.driveUrl);
        const videoUrl = firstEpWithVideo ? firstEpWithVideo.driveUrl! : '';
        
        // Extract image
        const imgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
        const thumbUrl = entry.media$thumbnail?.url || (imgMatch ? imgMatch[1] : `https://picsum.photos/seed/${index}/400/600`);
        
        // Replace Blogger thumbnail sizes for better quality
        const coverUrl = thumbUrl.replace(/\/s\d+-c\//, '/s600/').replace(/s72-c/, 's600');
        const heroUrl = thumbUrl.replace(/\/s\d+-c\//, '/s1920/').replace(/s72-c/, 's1920');

        // Categories
        const categories: string[] = entry.category ? entry.category.map((c: any) => c.term) : ['Anime'];
        
        // Determine type
        let type: ContentType = 'anime';
        if (categories.some((c: string) => c.toLowerCase().includes('movie') || c.toLowerCase().includes('filme'))) type = 'movie';
        else if (categories.some((c: string) => c.toLowerCase().includes('series') || c.toLowerCase().includes('temporada'))) type = 'series';

        // Get ID
        const idStr = entry.id.$t;
        const id = idStr.substring(idStr.lastIndexOf('-') + 1);

        return {
          id,
          title: entry.title.$t,
          type,
          genre: categories.slice(0, 3), 
          coverUrl,
          heroUrl: heroUrl || coverUrl,
          description: description,
          year: 2026,
          rating: 9.0 + (index % 10) / 10,
          videoUrl,
          episodes: episodeList,
          featured: index === 0
        };
      });

      resolve(items);
    };

    // Create and inject the JSONP script tag
    const script = document.createElement('script');
    script.id = callbackName;
    // Blogger natively supports JSONP via alt=json-in-script & callback=...
    script.src = `https://www.blogger.com/feeds/8967073085504555087/posts/default?alt=json-in-script&callback=${callbackName}&max-results=50`;
    
    script.onerror = () => {
      clearTimeout(timeoutId);
      cleanup();
      console.error("Failed to fetch Blogger JSONP script.");
      resolve([]);
    };

    document.body.appendChild(script);
  });
}
