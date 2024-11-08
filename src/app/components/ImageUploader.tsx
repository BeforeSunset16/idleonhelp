import { generateClient } from 'aws-amplify/data';
import type { Schema } from '#/amplify/data/resource';

interface PersonalImageUploaderProps {
  onComplete?: (imageUrl: string) => void;
  onError?: (error: Error) => void;
}

const client = generateClient<Schema>();

export default function PersonalImageUploader({ onComplete, onError }: PersonalImageUploaderProps) {
  const createPersonalImageRecord = async (imageUrl: string) => {
    try {
      await client.models.PersonalImage.create({
        imageUrl,
        active: 'T',
      });

      onComplete?.(imageUrl);
    } catch (error) {
      console.error('Error creating PersonalImage record:', error);
      onError?.(error as Error);
    }
  };

  return { createPersonalImageRecord };
}
