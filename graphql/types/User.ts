import { enumType, extendType, nonNull, objectType, stringArg } from 'nexus';
import jwt from 'jsonwebtoken';
import { setCookies } from 'cookies-next';
import { Link } from './Link';
import getUser from '../../utils/getUser';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('email');
    t.string('image');
    t.field('role', { type: Role });
    t.list.field('bookmarks', {
      type: Link,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .bookmarks();
      },
    });
  },
});

export const userMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('login', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
        image: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        await getUser(ctx.req, ctx.res);
        try {
          if (!args.email && !args.image) {
            throw new Error('Enter email and image');
          }
          const userEmail = await ctx.prisma.user.findUnique({
            where: { email: args.email },
          });
          if (userEmail) throw new Error('User with this email already exist');
          const user = await ctx.prisma.user.create({
            data: {
              email: args.email,
              image: args.image,
            },
          });
          const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET);
          setCookies('qid', token, {
            req: ctx.req,
            res: ctx.res,
            maxAge: 60 * 60 * 24,
            path: '/',
            sameSite: true,
            secure: true,
            httpOnly: true,
            domain: 'awesome-links-nine.vercel.app',
          });
          return user;
        } catch (error) {
          throw new Error(`failed to create login: ${error}`);
        }
      },
    });
  },
});

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      async resolve(_root, _args, ctx) {
        const user = await getUser(ctx.req, ctx.res);
        return user;
      },
    });
  },
});

const Role = enumType({
  name: 'Role',
  members: ['USER', 'ADMIN'],
});
