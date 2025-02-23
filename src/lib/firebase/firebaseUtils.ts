import { auth, db } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

export interface SoftwareSubmission {
  name: string;
  description: string;
  category: string;
  website: string;
  pricing: string;
  email: string;
  isFeatured: boolean;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export const submitSoftware = async (data: Omit<SoftwareSubmission, 'createdAt' | 'status' | 'isFeatured'>) => {
  try {
    console.log('Starting software submission process...')
    
    // Create the submission object
    const submission: SoftwareSubmission = {
      ...data,
      isFeatured: false,
      createdAt: new Date(),
      status: 'pending'
    }
    
    console.log('Prepared submission data:', submission)
    
    // Try to add the document
    try {
      const docRef = await addDoc(collection(db, 'software'), submission)
      console.log('Submission successful, doc ID:', docRef.id)
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Firestore write error:', error)
      if (error instanceof Error) {
        return { 
          success: false, 
          error: `Database error: ${error.message}. Please try again or contact support if the problem persists.` 
        }
      }
      return { success: false, error: 'Failed to save to database. Please try again.' }
    }
  } catch (error) {
    console.error('Submission process error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export const getLatestSoftware = async (featured: boolean = false, limit_count: number = 6) => {
  try {
    console.log('Fetching software with params:', { featured, limit_count })
    
    // Create a simpler query that doesn't require a composite index
    const q = query(
      collection(db, 'software'),
      where('status', '==', 'approved'),
      where('isFeatured', '==', featured)
    )

    console.log('Executing Firestore query...')
    const querySnapshot = await getDocs(q)
    const software = querySnapshot.docs
      .map(doc => {
        const data = doc.data()
        // Convert Firestore Timestamp to Date
        const createdAt = data.createdAt?.toDate?.() || data.createdAt
        return {
          id: doc.id,
          ...data,
          createdAt
        }
      })
      // Sort in memory instead of using orderBy in the query
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit_count)

    console.log('Found software:', software.length, 'entries')
    console.log('Software data:', software)

    return software
  } catch (error) {
    console.error('Error getting software:', error)
    return []
  }
}

export const getSoftwareByCategory = async (category: string) => {
  try {
    const q = query(
      collection(db, 'software'),
      where('status', '==', 'approved'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    const software = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return software
  } catch (error) {
    console.error('Error getting software by category:', error)
    return []
  }
}

// Function to add test entries
export const addTestEntries = async () => {
  try {
    const testEntries = [
      // Featured Entries
      {
        name: 'Gitea',
        description: 'A painless self-hosted Git service written in Go. Perfect for teams who want to host their own GitHub-like service.',
        category: 'development',
        website: 'https://gitea.io',
        pricing: 'Free / Open Source',
        email: 'test@example.com',
        isFeatured: true,
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        isTestData: true
      },
      {
        name: 'Nextcloud',
        description: 'Safe home for all your data - community-driven, free & open source. A self-hosted productivity platform with file sharing, collaboration tools, and more.',
        category: 'backup',
        website: 'https://nextcloud.com',
        pricing: 'Free / Enterprise',
        email: 'test@example.com',
        isFeatured: true,
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        isTestData: true
      },
      {
        name: 'Grafana',
        description: 'The open and composable observability and data visualization platform. Visualize metrics, logs, and traces from multiple sources.',
        category: 'monitoring',
        website: 'https://grafana.com',
        pricing: 'Free / Cloud',
        email: 'test@example.com',
        isFeatured: true,
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
        isTestData: true
      },
      // Regular Entries
      {
        name: 'WordPress',
        description: 'The world\'s most popular website builder and CMS. Create any type of website with a rich plugin ecosystem.',
        category: 'cms',
        website: 'https://wordpress.org',
        pricing: 'Free',
        email: 'test@example.com',
        isFeatured: false,
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
        isTestData: true
      },
      {
        name: 'PostgreSQL',
        description: 'The world\'s most advanced open source database. Powerful, reliable, and feature-rich relational database.',
        category: 'database',
        website: 'https://postgresql.org',
        pricing: 'Free',
        email: 'test@example.com',
        isFeatured: false,
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        isTestData: true
      },
      {
        name: 'Mattermost',
        description: 'Open source platform for secure collaboration. A self-hosted alternative to Slack with enterprise features.',
        category: 'communication',
        website: 'https://mattermost.com',
        pricing: 'Free / Enterprise',
        email: 'test@example.com',
        isFeatured: false,
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
        isTestData: true
      },
      {
        name: 'Prometheus',
        description: 'An open-source monitoring system with a dimensional data model, flexible query language, and alerting.',
        category: 'monitoring',
        website: 'https://prometheus.io',
        pricing: 'Free / Open Source',
        email: 'test@example.com',
        isFeatured: false,
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
        isTestData: true
      },
      {
        name: 'Jitsi',
        description: 'Multi-platform open-source video conferencing. Secure, flexible, and scalable video conferencing solution.',
        category: 'communication',
        website: 'https://jitsi.org',
        pricing: 'Free / Open Source',
        email: 'test@example.com',
        isFeatured: false,
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
        isTestData: true
      },
      {
        name: 'Drupal',
        description: 'Enterprise-grade CMS for ambitious digital experiences. Build complex websites and applications.',
        category: 'cms',
        website: 'https://drupal.org',
        pricing: 'Free / Open Source',
        email: 'test@example.com',
        isFeatured: false,
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), // 9 days ago
        isTestData: true
      },
      // Pending Entry
      {
        name: 'Ghost',
        description: 'Professional publishing platform. Modern, open source publishing for journalism & blogging.',
        category: 'cms',
        website: 'https://ghost.org',
        pricing: 'Free / Open Source',
        email: 'test@example.com',
        isFeatured: false,
        status: 'pending',
        createdAt: new Date(),
        isTestData: true
      },
      // Rejected Entry
      {
        name: 'TestApp',
        description: 'A test application submission that was rejected.',
        category: 'development',
        website: 'https://test.com',
        pricing: 'Free',
        email: 'test@example.com',
        isFeatured: false,
        status: 'rejected',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
        isTestData: true
      },
      // Disabled Entry
      {
        name: 'OldApp',
        description: 'A previously approved application that has been disabled.',
        category: 'development',
        website: 'https://old.com',
        pricing: 'Free',
        email: 'test@example.com',
        isFeatured: false,
        status: 'disabled',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
        isTestData: true
      }
    ]

    for (const entry of testEntries) {
      await addDoc(collection(db, 'software'), entry)
    }

    return { success: true, message: 'Test entries added successfully' }
  } catch (error) {
    console.error('Error adding test entries:', error)
    return { success: false, error: 'Failed to add test entries' }
  }
}
