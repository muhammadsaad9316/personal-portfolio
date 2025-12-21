import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Muhammad Saad Portfolio',
        short_name: 'Saad Portfolio',
        description: 'Portfolio of Muhammad Saad, Full Stack Developer and Cybersecurity Student.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#9089fc',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
