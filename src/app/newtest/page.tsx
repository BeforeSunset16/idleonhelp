'use client';

import React from 'react';
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "amplify/data/resource";
import outputs from '#/amplify_outputs.json';

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function ClientPage() {
  async function callFn() {
    const result = await client.queries.sayHello({ name: 'Amplify' });
    console.log(result);
  }

  return (
    <div>
      <button type="button" onClick={callFn}>Call sayHello()</button>
    </div>
  );
}
