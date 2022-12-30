import 'reflect-metadata';

import express from 'express';
import { container } from 'tsyringe';
import 'express-async-errors';

import { Connection } from 'typeorm';
import uploadConfig from '@config/upload.config';

import connection from '@shared/infra/typeorm';

import { PermissionsRepositoryInterface } from '@modules/permissions/repositories/permissions-repository.interface';
import { PermissionRepository } from '@modules/permissions/infra/typeorm/repositories/permission.repository';

import { AccessProfilesRepositoryInterface } from '@modules/access-profiles/repositories/access-profiles-repository.interface';
import { AccessProfileRepository } from '@modules/access-profiles/infra/typeorm/repositories/access-profile.repository';

import { SessionRepositoryInterface } from '@modules/session/repositories/session-repository.interface';
import { SessionRepository } from '@modules/session/infra/typeorm/repositories/session.repository';

import { UsersRepositoryInterface } from '@modules/users/repositories/user-repository.interface';
import { UserRepository } from '@modules/users/infra/typeorm/repositories/user.repository';

import {
  HashProvider,
  HashProviderInterface,
} from '@modules/session/providers/hash';
import {
  TokenProvider,
  TokenProviderInterface,
} from '@modules/session/providers/token';

import { sessionsRouter } from '@modules/session/infra/http/routes/sessions.routes';
import { usersRouter } from '@modules/users/infra/http/routes/user.routes';
import { accessProfilesRouter } from '@modules/access-profiles/infra/http/routes/access-profiles.routes';
import { permissionsRouter } from '@modules/permissions/infra/http/routes/permissions.routes';

import errorHandler from './middlewares/error-handler.middleware';

class App {
  public express: express.Application;

  public connection: Promise<Connection>;

  public constructor() {
    this.express = express();
    this.express.use(express.json());

    this.connection = connection();

    this.database();
    this.routes();
    this.middlewares();
  }

  private middlewares(): void {
    this.express.use(errorHandler);
  }

  private tsyringe(): void {
    container.registerSingleton<PermissionsRepositoryInterface>(
      'PermissionsRepository',
      PermissionRepository,
    );

    container.registerSingleton<AccessProfilesRepositoryInterface>(
      'AccessProfilesRepository',
      AccessProfileRepository,
    );

    container.registerSingleton<UsersRepositoryInterface>(
      'UsersRepository',
      UserRepository,
    );

    container.registerSingleton<SessionRepositoryInterface>(
      'SessionRepository',
      SessionRepository,
    );

    container.registerSingleton<HashProviderInterface>(
      'HashProvider',
      HashProvider,
    );

    container.registerSingleton<TokenProviderInterface>(
      'TokenProvider',
      TokenProvider,
    );
  }

  private database(): void {
    this.connection
      .then(() => {
        console.log(`📦  Connected to ${process.env.DATABASE}!`);
        this.startServer();
        this.tsyringe();
      })
      .catch(error => {
        console.log('❌  Error when initializing the database.');
        console.error(error);
      });
  }

  private startServer(): void {
    this.express.listen(process.env.PORT || 3333, () => {
      console.log(`🚀  Server started on port ${process.env.PORT || 3333}!`);
    });
  }

  private routes(): void {
    this.express.use('/files', express.static(uploadConfig.uploadsFolder));

    this.express.use('/api/session', sessionsRouter);
    this.express.use('/api/user', usersRouter);
    this.express.use('/api/access-profile', accessProfilesRouter);
    this.express.use('/api/permission', permissionsRouter);
  }
}

export default new App().express;
