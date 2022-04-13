// graphql/context.ts
import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';
import { Claims, getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import getUser from '../utils/getUser';

export type Context = {
  user?: Claims;
  accessToken?: string;
  prisma: PrismaClient;
  req: NextApiRequest;
  res: NextApiResponse;
};

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<Context> {
  const session = getSession(req, res);
  await getUser(req, res);
  // if the user is not logged in, omit returning the user and accessToken
  if (!session) return { prisma, req, res };

  const { user, accessToken } = session;

  return {
    user,
    accessToken,
    req,
    res,
    prisma,
  };
}
