import { getCachedHeroContent } from '@/lib/cache';
import HeroClient from './HeroClient';

export default async function Hero() {
    const content = await getCachedHeroContent();
    return <HeroClient content={content} />;
}
