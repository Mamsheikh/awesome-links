import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { IDecodedToken } from './types';

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = getCookie('qid', { req, res });
  //   console.log('token', token);
  try {
    const data = <IDecodedToken>(
      jwt.verify(token as string, process.env.TOKEN_SECRET)
    );
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    return user;
  } catch (error) {
    return null;
  }
}
