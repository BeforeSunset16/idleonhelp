import { defineStorage } from '@aws-amplify/backend';
//https://docs.amplify.aws/react/build-a-backend/storage/upload-files/
export const storage = defineStorage({
  name: 'idleonhelp',
  access: (allow) => ({
    'shared-images/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read'])
    ],
  }),
});