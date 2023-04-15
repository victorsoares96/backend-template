import {MigrationInterface, QueryRunner} from "typeorm";

export class createDatabase1681591778031 implements MigrationInterface {
    name = 'createDatabase1681591778031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_240853a0c3353c25fb12434ad3\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`session\` (\`id\` char(36) NOT NULL, \`expires_in\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`status\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by_id\` varchar(255) NULL, \`created_by_name\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by_id\` varchar(255) NULL, \`updated_by_name\` varchar(255) NULL, \`deletion_date\` datetime(6) NULL, \`last_access\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`accessProfileId\` int NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`access_profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`status\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by_id\` varchar(255) NULL, \`created_by_name\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by_id\` varchar(255) NULL, \`updated_by_name\` varchar(255) NULL, \`deletion_date\` datetime(6) NULL, UNIQUE INDEX \`IDX_d119c02b32e455f1d52067fb8e\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`access_profiles_permissions\` (\`accessProfileId\` int NOT NULL, \`permissionId\` int NOT NULL, INDEX \`IDX_eba6860730fc17e3c58d5bf957\` (\`accessProfileId\`), INDEX \`IDX_940f523eb8bf1d3680cee875f7\` (\`permissionId\`), PRIMARY KEY (\`accessProfileId\`, \`permissionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_30e98e8746699fb9af235410aff\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_5a2922ec9809f3f794c9924ae9a\` FOREIGN KEY (\`accessProfileId\`) REFERENCES \`access_profile\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`access_profiles_permissions\` ADD CONSTRAINT \`FK_eba6860730fc17e3c58d5bf957e\` FOREIGN KEY (\`accessProfileId\`) REFERENCES \`access_profile\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`access_profiles_permissions\` ADD CONSTRAINT \`FK_940f523eb8bf1d3680cee875f73\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`access_profiles_permissions\` DROP FOREIGN KEY \`FK_940f523eb8bf1d3680cee875f73\``);
        await queryRunner.query(`ALTER TABLE \`access_profiles_permissions\` DROP FOREIGN KEY \`FK_eba6860730fc17e3c58d5bf957e\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_5a2922ec9809f3f794c9924ae9a\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_30e98e8746699fb9af235410aff\``);
        await queryRunner.query(`DROP INDEX \`IDX_940f523eb8bf1d3680cee875f7\` ON \`access_profiles_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_eba6860730fc17e3c58d5bf957\` ON \`access_profiles_permissions\``);
        await queryRunner.query(`DROP TABLE \`access_profiles_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_d119c02b32e455f1d52067fb8e\` ON \`access_profile\``);
        await queryRunner.query(`DROP TABLE \`access_profile\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`session\``);
        await queryRunner.query(`DROP INDEX \`IDX_240853a0c3353c25fb12434ad3\` ON \`permission\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
    }

}
