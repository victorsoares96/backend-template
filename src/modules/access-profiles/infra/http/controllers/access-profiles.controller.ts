import { Request, Response } from 'express';
import { container } from 'tsyringe';

import {
  CreateAccessProfileService,
  Request as CreateRequest,
} from '@modules/access-profiles/services/create-access-profile.service';
import { FindManyAccessProfileService } from '@modules/access-profiles/services/find-many-access-profile.service';
import { InactiveAccessProfileService } from '@modules/access-profiles/services/inactive-access-profile.service';
import { RecoverAccessProfileService } from '@modules/access-profiles/services/recover-access-profile.service';
import { RemoveAccessProfileService } from '@modules/access-profiles/services/remove-access-profile.service';
import { SoftRemoveAccessProfileService } from '@modules/access-profiles/services/soft-remove-access-profile.service';
import { UpdateAccessProfileService } from '@modules/access-profiles/services/update-access-profile.service';
import { FindManyAccessProfileDTO } from '@modules/access-profiles/dtos/find-many-access-profile.dto';

export class AccessProfilesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      permissionsId,
      description,
      createdById,
      createdByName,
      updatedById,
      updatedByName,
    } = request.body as CreateRequest;

    const createAccessProfile = container.resolve(CreateAccessProfileService);
    const accessProfile = await createAccessProfile.execute({
      name,
      permissionsId,
      description,
      createdById,
      createdByName,
      updatedById,
      updatedByName,
    });

    return response.json(accessProfile);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const filters = request.body as FindManyAccessProfileDTO;

    const findAccessProfiles = container.resolve(FindManyAccessProfileService);
    const permissions = await findAccessProfiles.execute(filters);

    return response.json(permissions);
  }

  public async inactive(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { ids } = request.body;
    const { id: userId, name: userName } = request.user;

    const inactiveAccessProfile = container.resolve(
      InactiveAccessProfileService,
    );

    await inactiveAccessProfile.execute({
      ids,
      updatedById: userId,
      updatedByName: userName,
    });

    return response.send();
  }

  public async recover(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { ids } = request.body;
    const { id: userId, name: userName } = request.user;

    const recoverAccessProfiles = container.resolve(
      RecoverAccessProfileService,
    );

    await recoverAccessProfiles.execute({
      ids,
      updatedById: userId,
      updatedByName: userName,
    });

    return response.send();
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { ids } = request.body;

    const removeAccessProfiles = container.resolve(RemoveAccessProfileService);

    await removeAccessProfiles.execute({
      ids,
    });

    return response.send();
  }

  public async softRemove(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { ids } = request.body;

    const softRemoveAccessProfiles = container.resolve(
      SoftRemoveAccessProfileService,
    );

    await softRemoveAccessProfiles.execute({
      ids,
    });

    return response.send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: userId, name: userName } = request.user;
    const { id, name, permissionsId, description } = request.body;

    const updateAccessProfile = container.resolve(UpdateAccessProfileService);

    const accessProfile = await updateAccessProfile.execute({
      id,
      name,
      permissionsId,
      description,
      updatedById: userId,
      updatedByName: userName,
    });

    return response.json(accessProfile);
  }
}
