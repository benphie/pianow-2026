// Database utility functions using Supabase with in-memory fallback
import { User, Lesson, Teacher, Product, Cart, Order, TeacherApplication, PracticeSessionRecord, NotificationRecord } from './types'
import { supabaseAdmin as supabase, isSupabaseConfigured } from './supabase'

// Mock user storage (in-memory for demo, syncs with Supabase if configured)
const globalStore = globalThis as unknown as {
  __mockUsers?: Map<string, any>
  __mockLessons?: Map<string, Lesson>
  __mockProducts?: Map<string, Product>
  __mockTeachers?: Map<string, Teacher>
  __mockCarts?: Map<string, Cart>
  __mockOrders?: Map<string, Order[]>
  __mockTeacherApplications?: Map<string, TeacherApplication>
}

if (!globalStore.__mockUsers) {
  globalStore.__mockUsers = new Map([
    ['test@example.com', {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: '$2b$10$YJLr5rIDxXGpVf3l8.T2t.v5.vW2KsJfQXK2Xb0wN5c0wZ5c0wZ5c', // hashed 'password123'
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }],
    ['google.user@gmail.com', {
      id: '2',
      email: 'google.user@gmail.com',
      name: 'Google User',
      password: '$2b$10$YJLr5rIDxXGpVf3l8.T2t.v5.vW2KsJfQXK2Xb0wN5c0wZ5c0wZ5c',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }],
    ['kingschat.user@kingschat.com', {
      id: '3',
      email: 'kingschat.user@kingschat.com',
      name: 'Kings Chat User',
      password: '$2b$10$YJLr5rIDxXGpVf3l8.T2t.v5.vW2KsJfQXK2Xb0wN5c0wZ5c0wZ5c',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kingschat',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]
  ]);
}
const mockUsers: Map<string, any> = globalStore.__mockUsers;

// In-memory lessons fallback
const initialLessons: Lesson[] = [
  {
    id: '1',
    title: '10 Steps to Improvise Jazz',
    description: 'Master the fundamentals of jazz improvisation with this comprehensive step-by-step guide.',
    videoUrl: '/video lessons/10 STEPS TO IMPROVISE JAZZ.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '60 minutes',
    level: 'Intermediate',
    teacherId: '1',
    thumbnail: '/video lessons/10 STEPS TO IMPROVISE JAZZ.mp4',
    price: 0,
    isFree: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Improvising Beautiful Melodies On The Piano',
    description: 'Learn to create stunning melodies and express yourself through piano improvisation.',
    videoUrl: '/video lessons/Improvising Beautiful Melodies On The Piano.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '45 minutes',
    level: 'Intermediate',
    teacherId: '1',
    thumbnail: '/video lessons/Improvising Beautiful Melodies On The Piano.mp4',
    price: 0,
    isFree: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Left Hand Arpeggio Patterns',
    description: 'Master essential left-hand arpeggio patterns to enhance your piano playing technique.',
    videoUrl: '/video lessons/Left Hand Arpeggio Patterns (Piano Lesson).mp4',
    duration: '35 minutes',
    level: 'Beginner',
    teacherId: '2',
    thumbnail: '/video lessons/Left Hand Arpeggio Patterns (Piano Lesson).mp4',
    price: 0,
    isFree: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Dramatic Piano Playing with Arpeggios',
    description: 'Create dramatic and emotional piano arrangements using dynamic arpeggios.',
    videoUrl: '/video lessons/Make Your Piano Playing Instantly More Dramatic (Arpeggio Patterns for Intensity and Mood).mp4',
    duration: '50 minutes',
    level: 'Intermediate',
    teacherId: '1',
    thumbnail: '/video lessons/Make Your Piano Playing Instantly More Dramatic (Arpeggio Patterns for Intensity and Mood).mp4',
    price: 29.99,
    isFree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockLessons: Map<string, Lesson> = new Map(initialLessons.map(l => [l.id, l]));

// In-memory products fallback
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Yamaha CP88 Stage Piano',
    description: 'Professional stage piano with authentic acoustic piano and vintage electric piano sounds.',
    price: 2499,
    originalPrice: 2799,
    category: 'piano',
    images: ['/PHOTOS FOR THE APP/YAMAHA CP88/Yamaha CP88.avif'],
    inStock: true,
    stockQuantity: 15,
    brand: 'Yamaha',
    rating: 4.9,
    reviews: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Casio Privia PX-870 Digital Piano',
    description: 'Flagship Privia digital piano featuring multi-dimensional morphing AiR sound source.',
    price: 899,
    originalPrice: 1099,
    category: 'piano',
    images: ['/PHOTOS FOR THE APP/CASIO PRIVIA PX 870/Casio Privia PX-870.avif'],
    inStock: true,
    stockQuantity: 22,
    brand: 'Casio',
    rating: 4.7,
    reviews: 203,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Kawai ES920 Digital Piano',
    description: 'Portable digital piano with Responsive Hammer III action and Harmonic Imaging XL sound.',
    price: 1899,
    originalPrice: 2199,
    category: 'piano',
    images: ['/PHOTOS FOR THE APP/KAWAI ES920/Kawai ES920a.jpg'],
    inStock: true,
    stockQuantity: 8,
    brand: 'Kawai',
    rating: 4.8,
    reviews: 127,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Roland FP-30X Digital Piano',
    description: 'SuperNATURAL Piano sound engine with 88-note PHA-4 Standard keyboard.',
    price: 799,
    category: 'piano',
    images: ['/PHOTOS FOR THE APP/ROLAND FP 30X/Roland FP-30X.jpg'],
    inStock: true,
    stockQuantity: 14,
    brand: 'Roland',
    rating: 4.6,
    reviews: 189,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Korg Grand Stage 88',
    description: 'Flagship stage piano featuring seven distinct sound engines in a stunning chassis.',
    price: 3299,
    originalPrice: 3599,
    category: 'piano',
    images: ['/PHOTOS FOR THE APP/KORG GRAND STAGE 88/Korg Grandstage 88.jpg'],
    inStock: true,
    stockQuantity: 5,
    brand: 'Korg',
    rating: 4.9,
    reviews: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockProducts: Map<string, Product> = new Map(initialProducts.map(p => [p.id, p]));

// In-memory teachers fallback
const initialTeachers: Teacher[] = [
  {
    id: '1',
    userId: '1',
    name: 'Sarah Johnson',
    bio: 'Concert pianist and educator with over 15 years of international teaching and performing experience.',
    specialties: ['Classical', 'Jazz', 'Beginner-friendly'],
    education: ['Juilliard School of Music - MM Piano Performance'],
    certifications: ['Steinway Educational Partner', 'MTNA Certified'],
    rating: 4.9,
    totalStudents: 1234,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '2',
    name: 'Mike Rodriguez',
    bio: 'Touring guitarist and music producer specializing in blues, rock, and modern fingerstyle technique.',
    specialties: ['Rock', 'Blues', 'Acoustic'],
    education: ['Berklee College of Music'],
    certifications: ['Certified Audio Engineer'],
    rating: 4.8,
    totalStudents: 987,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: '3',
    name: 'Alex Thompson',
    bio: 'Session drummer and percussion instructor helping students build groove, timing, and stage confidence.',
    specialties: ['Rock', 'Jazz', 'Latin'],
    education: ['Musicians Institute, Hollywood'],
    certifications: ['Vic Firth Education Team'],
    rating: 4.7,
    totalStudents: 756,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockTeachers: Map<string, Teacher> = new Map(initialTeachers.map(t => [t.id, t]));

// In-memory carts and orders
const mockCarts: Map<string, Cart> = new Map();
const mockOrders: Map<string, Order[]> = new Map();

// Users
export async function getUserById(id: string): Promise<User | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          avatar: data.avatar,
          role: data.role,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      }
    } catch (e) {
      console.warn('Supabase getUserById failed, using fallback:', e)
    }
  }

  for (const user of mockUsers.values()) {
    if (user.id === id) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }
  return null;
}

export async function getUserByEmail(email: string): Promise<User & { password: string } | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email.trim())
        .single()
      
      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          password: data.password_hash || data.password,
          avatar: data.avatar,
          role: data.role,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      }
    } catch (e) {
      console.warn('Supabase getUserByEmail failed, using fallback:', e)
    }
  }

  const user = mockUsers.get(email.toLowerCase().trim());
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

export async function createUser(userData: {
  email: string
  name: string
  password_hash: string
  role?: string
}): Promise<User> {
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.email)}`
  const role = userData.role || 'user'
  const normalizedEmail = userData.email.toLowerCase().trim()

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: normalizedEmail,
          name: userData.name,
          password_hash: userData.password_hash,
          avatar,
          role,
        })
        .select('*')
        .single()

      if (!error && data) {
        const user: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          avatar: data.avatar,
          role: data.role,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
        mockUsers.set(normalizedEmail, {
          ...user,
          password: userData.password_hash,
        })
        return user
      }
    } catch (e) {
      console.warn('Supabase createUser failed, using fallback:', e)
    }
  }

  const id = Math.random().toString(36).substring(7);
  const user = {
    id,
    email: normalizedEmail,
    name: userData.name,
    password: userData.password_hash,
    avatar,
    role: (role as any),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  mockUsers.set(normalizedEmail, user);
  
  const { password, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

// Lessons
export async function getLessons(): Promise<Lesson[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data && data.length > 0) {
        return data.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.video_url,
          youtubeUrl: lesson.youtube_url,
          duration: lesson.duration,
          level: lesson.level,
          teacherId: lesson.teacher_id,
          thumbnail: lesson.thumbnail,
          price: lesson.price ? Number(lesson.price) : undefined,
          isFree: lesson.is_free,
          createdAt: lesson.created_at,
          updatedAt: lesson.updated_at,
        }))
      }
    } catch (e) {
      console.warn('Supabase getLessons failed, using fallback:', e);
    }
  }
  return Array.from(mockLessons.values());
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single()
      
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          videoUrl: data.video_url,
          youtubeUrl: data.youtube_url,
          duration: data.duration,
          level: data.level,
          teacherId: data.teacher_id,
          thumbnail: data.thumbnail,
          price: data.price ? Number(data.price) : undefined,
          isFree: data.is_free,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      }
    } catch (e) {
      console.warn('Supabase getLessonById failed, using fallback:', e);
    }
  }
  return mockLessons.get(id) || null;
}

export async function createLesson(lessonData: Partial<Lesson>): Promise<Lesson> {
  const id = Math.random().toString(36).substring(7);
  const newLesson: Lesson = {
    id,
    title: lessonData.title || 'Untitled Lesson',
    description: lessonData.description || '',
    videoUrl: lessonData.videoUrl,
    youtubeUrl: lessonData.youtubeUrl,
    duration: lessonData.duration || '30 minutes',
    level: (lessonData.level as any) || 'Beginner',
    teacherId: lessonData.teacherId || '1',
    thumbnail: lessonData.thumbnail,
    price: lessonData.price,
    isFree: lessonData.isFree ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          title: newLesson.title,
          description: newLesson.description,
          video_url: newLesson.videoUrl,
          youtube_url: newLesson.youtubeUrl,
          duration: newLesson.duration,
          level: newLesson.level,
          teacher_id: newLesson.teacherId,
          thumbnail: newLesson.thumbnail,
          price: newLesson.price,
          is_free: newLesson.isFree,
        })
        .select('*')
        .single()
      
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          videoUrl: data.video_url,
          youtubeUrl: data.youtube_url,
          duration: data.duration,
          level: data.level,
          teacherId: data.teacher_id,
          thumbnail: data.thumbnail,
          price: data.price ? Number(data.price) : undefined,
          isFree: data.is_free,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      }
    } catch (e) {
      console.warn('Supabase createLesson failed, storing in memory:', e);
    }
  }

  mockLessons.set(id, newLesson);
  return newLesson;
}

export async function updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update({
          title: updates.title,
          description: updates.description,
          video_url: updates.videoUrl,
          youtube_url: updates.youtubeUrl,
          duration: updates.duration,
          level: updates.level,
          teacher_id: updates.teacherId,
          thumbnail: updates.thumbnail,
          price: updates.price,
          is_free: updates.isFree,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          videoUrl: data.video_url,
          youtubeUrl: data.youtube_url,
          duration: data.duration,
          level: data.level,
          teacherId: data.teacher_id,
          thumbnail: data.thumbnail,
          price: data.price ? Number(data.price) : undefined,
          isFree: data.is_free,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase updateLesson failed, updating in memory:', e);
    }
  }

  const existing = mockLessons.get(id);
  if (!existing) return null;
  const updated: Lesson = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  mockLessons.set(id, updated);
  return updated;
}

export async function deleteLesson(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase deleteLesson failed, deleting from memory:', e);
    }
  }
  return mockLessons.delete(id);
}

// Products
export async function getProducts(category?: string): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          originalPrice: product.original_price ? Number(product.original_price) : undefined,
          category: product.category,
          images: product.images || [],
          inStock: product.in_stock,
          stockQuantity: product.stock_quantity,
          brand: product.brand,
          rating: product.rating ? Number(product.rating) : undefined,
          reviews: product.reviews,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getProducts failed, using fallback:', e);
    }
  }

  const all = Array.from(mockProducts.values());
  if (category) {
    return all.filter(p => p.category === category || p.brand?.toLowerCase() === category.toLowerCase());
  }
  return all;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          originalPrice: data.original_price ? Number(data.original_price) : undefined,
          category: data.category,
          images: data.images || [],
          inStock: data.in_stock,
          stockQuantity: data.stock_quantity,
          brand: data.brand,
          rating: data.rating ? Number(data.rating) : undefined,
          reviews: data.reviews,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase getProductById failed, using fallback:', e);
    }
  }
  return mockProducts.get(id) || null;
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const id = `prod-${Date.now()}`;
  const newProduct: Product = {
    id,
    name: productData.name || '',
    description: productData.description || '',
    price: Number(productData.price) || 0,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
    category: productData.category || 'instruments',
    images: productData.images || [],
    inStock: productData.inStock !== false,
    stockQuantity: productData.stockQuantity || 10,
    brand: productData.brand,
    rating: productData.rating || 5,
    reviews: productData.reviews || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          category: newProduct.category,
          images: newProduct.images,
          in_stock: newProduct.inStock,
          stock_quantity: newProduct.stockQuantity,
          brand: newProduct.brand,
        })
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          originalPrice: data.original_price ? Number(data.original_price) : undefined,
          category: data.category,
          images: data.images || [],
          inStock: data.in_stock,
          stockQuantity: data.stock_quantity,
          brand: data.brand,
          rating: data.rating ? Number(data.rating) : undefined,
          reviews: data.reviews,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase createProduct failed, storing in memory:', e);
    }
  }

  mockProducts.set(id, newProduct);
  return newProduct;
}

// Teachers
export async function getTeachers(): Promise<Teacher[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        return data.map(teacher => ({
          id: teacher.id,
          userId: teacher.user_id,
          name: teacher.name,
          bio: teacher.bio,
          specialties: teacher.specialties || [],
          education: teacher.education || [],
          certifications: teacher.certifications || [],
          rating: Number(teacher.rating),
          totalStudents: teacher.total_students,
          avatar: teacher.avatar,
          createdAt: teacher.created_at,
          updatedAt: teacher.updated_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getTeachers failed, using fallback:', e);
    }
  }
  return Array.from(mockTeachers.values());
}

export async function createTeacher(teacherData: Partial<Teacher>): Promise<Teacher> {
  const id = `teacher-${Date.now()}`;
  const newTeacher: Teacher = {
    id,
    userId: teacherData.userId || id,
    name: teacherData.name || '',
    bio: teacherData.bio || '',
    specialties: teacherData.specialties || [],
    education: teacherData.education || [],
    certifications: teacherData.certifications || [],
    rating: 5,
    totalStudents: 0,
    avatar: teacherData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert({
          user_id: newTeacher.userId,
          name: newTeacher.name,
          bio: newTeacher.bio,
          specialties: newTeacher.specialties,
          education: newTeacher.education,
          certifications: newTeacher.certifications,
          rating: 0,
          total_students: 0,
        })
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          name: data.name,
          bio: data.bio,
          specialties: data.specialties || [],
          education: data.education || [],
          certifications: data.certifications || [],
          rating: Number(data.rating),
          totalStudents: data.total_students,
          avatar: data.avatar,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase createTeacher failed, storing in memory:', e);
    }
  }

  mockTeachers.set(id, newTeacher);
  return newTeacher;
}

// Cart
export async function getCart(userId: string): Promise<Cart | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        return {
          userId: data.user_id,
          items: data.items || [],
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase getCart failed, using fallback:', e);
    }
  }

  let cart = mockCarts.get(userId);
  if (!cart) {
    cart = {
      userId,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    mockCarts.set(userId, cart);
  }
  return cart;
}

export async function updateCart(userId: string, items: Cart['items']): Promise<Cart> {
  const updatedCart: Cart = {
    userId,
    items,
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('carts')
        .upsert({
          user_id: userId,
          items,
        })
        .select('*')
        .single();
      
      if (!error && data) {
        return {
          userId: data.user_id,
          items: data.items || [],
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase updateCart failed, saving to memory:', e);
    }
  }

  mockCarts.set(userId, updatedCart);
  return updatedCart;
}

// Orders
export async function getOrders(userId: string): Promise<Order[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return data.map(order => ({
          id: order.id,
          userId: order.user_id,
          items: order.items,
          total: Number(order.total),
          status: order.status,
          shippingAddress: order.shipping_address,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getOrders failed, using fallback:', e);
    }
  }

  return mockOrders.get(userId) || [];
}

export async function createOrder(orderData: {
  userId: string
  items: Order['items']
  total: number
  shippingAddress?: Order['shippingAddress']
}): Promise<Order> {
  const id = Math.random().toString(36).substring(7);
  const newOrder: Order = {
    id,
    userId: orderData.userId,
    items: orderData.items,
    total: orderData.total,
    shippingAddress: orderData.shippingAddress,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.userId,
          items: orderData.items,
          total: orderData.total,
          shipping_address: orderData.shippingAddress,
          status: 'pending',
        })
        .select('*')
        .single();
      
      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          items: data.items,
          total: Number(data.total),
          status: data.status,
          shippingAddress: data.shipping_address,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase createOrder failed, saving to memory:', e);
    }
  }

  const existing = mockOrders.get(orderData.userId) || [];
  mockOrders.set(orderData.userId, [newOrder, ...existing]);
  return newOrder;
}

// In-memory Teacher Applications fallback
if (!globalStore.__mockTeacherApplications) {
  globalStore.__mockTeacherApplications = new Map();
}
const mockTeacherApplications: Map<string, TeacherApplication> = globalStore.__mockTeacherApplications;

export async function createTeacherApplication(data: Partial<TeacherApplication>): Promise<TeacherApplication> {
  const id = `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  
  const application: TeacherApplication = {
    id,
    userId: data.userId || undefined,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    location: data.location || '',
    instruments: data.instruments || [],
    experience: data.experience || '',
    education: data.education || '',
    certifications: data.certifications || '',
    teachingExperience: data.teachingExperience || '',
    timezone: data.timezone || '',
    availableHours: data.availableHours || '',
    preferredAgeGroups: data.preferredAgeGroups || [],
    bio: data.bio || '',
    teachingPhilosophy: data.teachingPhilosophy || '',
    sampleVideoUrl: data.sampleVideoUrl || '',
    references: data.references || '',
    status: data.status || 'pending',
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseConfigured) {
    try {
      const { data: inserted, error } = await supabase
        .from('teacher_applications')
        .insert({
          id,
          user_id: application.userId || null,
          first_name: application.firstName,
          last_name: application.lastName,
          email: application.email,
          phone: application.phone,
          location: application.location,
          instruments: application.instruments,
          experience: application.experience,
          education: application.education,
          certifications: application.certifications,
          teaching_experience: application.teachingExperience,
          timezone: application.timezone,
          available_hours: application.availableHours,
          preferred_age_groups: application.preferredAgeGroups,
          bio: application.bio,
          teaching_philosophy: application.teachingPhilosophy,
          sample_video_url: application.sampleVideoUrl,
          references_info: application.references,
          status: application.status,
          created_at: now,
          updated_at: now,
        })
        .select('*')
        .single();

      if (!error && inserted) {
        application.id = inserted.id;
      }
    } catch (e) {
      console.warn('Supabase insert into teacher_applications failed, stored in memory:', e);
    }
  }

  mockTeacherApplications.set(application.id, application);
  if (application.email) {
    mockTeacherApplications.set(application.email.toLowerCase(), application);
  }
  return application;
}

export async function getTeacherApplications(): Promise<TeacherApplication[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          firstName: d.first_name,
          lastName: d.last_name,
          email: d.email,
          phone: d.phone,
          location: d.location,
          instruments: d.instruments || [],
          experience: d.experience,
          education: d.education,
          certifications: d.certifications,
          teachingExperience: d.teaching_experience,
          timezone: d.timezone,
          availableHours: d.available_hours,
          preferredAgeGroups: d.preferred_age_groups || [],
          bio: d.bio,
          teachingPhilosophy: d.teaching_philosophy,
          sampleVideoUrl: d.sample_video_url,
          references: d.references_info,
          status: d.status,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getTeacherApplications failed, using memory fallback:', e);
    }
  }
  // Return distinct by id
  const uniqueApps = new Map<string, TeacherApplication>();
  mockTeacherApplications.forEach(app => uniqueApps.set(app.id, app));
  return Array.from(uniqueApps.values()).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getTeacherApplicationByEmail(email: string): Promise<TeacherApplication | null> {
  const normEmail = email.toLowerCase().trim();
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .ilike('email', normEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          instruments: data.instruments || [],
          experience: data.experience,
          education: data.education,
          certifications: data.certifications,
          teachingExperience: data.teaching_experience,
          timezone: data.timezone,
          availableHours: data.available_hours,
          preferredAgeGroups: data.preferred_age_groups || [],
          bio: data.bio,
          teachingPhilosophy: data.teaching_philosophy,
          sampleVideoUrl: data.sample_video_url,
          references: data.references_info,
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase getTeacherApplicationByEmail failed:', e);
    }
  }

  for (const app of mockTeacherApplications.values()) {
    if (app.email.toLowerCase().trim() === normEmail) {
      return app;
    }
  }
  return null;
}

export async function getTeacherApplicationByUserId(userId: string): Promise<TeacherApplication | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          instruments: data.instruments || [],
          experience: data.experience,
          education: data.education,
          certifications: data.certifications,
          teachingExperience: data.teaching_experience,
          timezone: data.timezone,
          availableHours: data.available_hours,
          preferredAgeGroups: data.preferred_age_groups || [],
          bio: data.bio,
          teachingPhilosophy: data.teaching_philosophy,
          sampleVideoUrl: data.sample_video_url,
          references: data.references_info,
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase getTeacherApplicationByUserId failed:', e);
    }
  }

  for (const app of mockTeacherApplications.values()) {
    if (app.userId === userId) {
      return app;
    }
  }
  return null;
}
