export interface Property {
    id: string;
    slug: string;
    reference?: string;
    title: string;
    description: string;
    price: number;
    location: string;
    type: 'Vente' | 'Location';
    status: 'Disponible' | 'Vendu' | 'Loué';
    images: string[];
    video?: string;
    features: {
        bedrooms?: number;
        bathrooms?: number;
        area: number; // m2
        amenities: string[];
        condition?: string;
        category?: string; // e.g. Villa, Appartement, Immeuble
        floors?: number;
        apartments?: number;
        livingRooms?: number;
        kitchens?: number;
        parking?: number;
        furnished?: boolean;
        rentalPeriod?: 'Month' | 'Day';
        specialNote?: string;
    };
    ownerName?: string;
    ownerPhone?: string;
    created_at: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    cover_image?: string;
    published: boolean;
    author: string;
    is_featured?: boolean;
    created_at: string;
    updated_at: string;
}

export type PropertyInput = Omit<Property, 'id' | 'created_at' | 'user_id' | 'likes'>;
export type PostInput = Omit<Post, 'id' | 'created_at' | 'updated_at'>;
