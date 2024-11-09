import { generateClient } from 'aws-amplify/data';
import type { Schema } from '#/amplify/data/resource';

interface SharedImageUploaderProps {
  onComplete?: (imageUrl: string) => void;
  onError?: (error: Error) => void;
}

const client = generateClient<Schema>();

export default function SharedImageUploader({ onComplete, onError }: SharedImageUploaderProps) {
  const createSharedImageRecord = async (imageUrl: string) => {
    try {
      await client.models.SharedImage.create({
        imageUrl,
        active: 'T',
      });

      onComplete?.(imageUrl);
    } catch (error) {
      console.error('Error creating SharedImage record:', error);
      onError?.(error as Error);
    }
  };

  return { createSharedImageRecord };
}
