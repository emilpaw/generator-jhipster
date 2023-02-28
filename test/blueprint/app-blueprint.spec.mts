/* eslint-disable no-unused-expressions */
import path from 'path';
import assert from 'yeoman-assert';
import fse from 'fs-extra';
import { jestExpect } from 'mocha-expect-snapshot';
import { basicHelpers as helpers } from '../support/index.mjs';
import EnvironmentBuilder from '../../cli/environment-builder.mjs';
import { getTemplatePath } from '../support/index.mjs';
import { packageJson } from '../../lib/index.mjs';
import { GENERATOR_APP } from '../../generators/generator-list.mjs';

const jhipsterVersion = packageJson.version;

describe('generator - app - with blueprint', () => {
  describe('generate application with a version-compatible blueprint', () => {
    let runResult;
    before(async () => {
      runResult = await helpers
        .create('jhipster:app', {}, { createEnv: EnvironmentBuilder.createEnv })
        .inTmpDir(dir => {
          // Fake the presence of the blueprint in node_modules
          const packagejs = {
            name: 'generator-jhipster-myblueprint',
            version: '9.9.9',
            type: 'module',
            dependencies: {
              'generator-jhipster': jhipsterVersion,
            },
          };
          const fakeBlueprintModuleDir = path.join(dir, 'node_modules/generator-jhipster-myblueprint');
          fse.ensureDirSync(fakeBlueprintModuleDir);
          fse.copySync(getTemplatePath('blueprints/fake-blueprint'), fakeBlueprintModuleDir);
          fse.writeJsonSync(path.join(fakeBlueprintModuleDir, 'package.json'), packagejs);
        })
        .withJHipsterConfig()
        .withOptions({
          skipChecks: false,
          blueprint: 'myblueprint',
        })
        .run();
    });

    it('creates expected default files for server and angular', () => {
      jestExpect(runResult.getStateSnapshot()).toMatchSnapshot();
    });

    it('blueprint version is saved in .yo-rc.json', () => {
      assert.JSONFileContent('.yo-rc.json', {
        'generator-jhipster': { blueprints: [{ name: 'generator-jhipster-myblueprint', version: '9.9.9' }] },
      });
    });
    it('blueprint module and version are in package.json', () => {
      assert.fileContent('package.json', /"generator-jhipster-myblueprint": "9.9.9"/);
    });
  });

  describe('generate application with a conflicting version blueprint', () => {
    it('throws an error', () =>
      jestExpect(() =>
        helpers
          .runJHipster(GENERATOR_APP)
          .inTmpDir(dir => {
            // Fake the presence of the blueprint in node_modules
            const packagejs = {
              name: 'generator-jhipster-myblueprint',
              version: '9.9.9',
              type: 'module',
              dependencies: {
                'generator-jhipster': '1.1.1',
              },
            };
            const fakeBlueprintModuleDir = path.join(dir, 'node_modules/generator-jhipster-myblueprint');
            fse.ensureDirSync(fakeBlueprintModuleDir);
            fse.copySync(getTemplatePath('blueprints/fake-blueprint'), fakeBlueprintModuleDir);
            fse.writeJsonSync(path.join(fakeBlueprintModuleDir, 'package.json'), packagejs);
          })
          .withJHipsterConfig()
          .withOptions({
            skipChecks: false,
            blueprint: 'myblueprint',
          })
      ).rejects.toThrow(/targets JHipster v1.1.1 and is not compatible with this JHipster version/));
  });

  describe('generating application with a git blueprint', () => {
    it('should succeed', () =>
      helpers
        .runJHipster(GENERATOR_APP)
        .inTmpDir(dir => {
          // Fake the presence of the blueprint in node_modules
          const packagejs = {
            name: 'generator-jhipster-myblueprint',
            version: '9.9.9',
            type: 'module',
            dependencies: {
              'generator-jhipster': 'gitlab:jhipster/generator-jhipster#main',
            },
          };
          const fakeBlueprintModuleDir = path.join(dir, 'node_modules/generator-jhipster-myblueprint');
          fse.ensureDirSync(fakeBlueprintModuleDir);
          fse.copySync(getTemplatePath('blueprints/fake-blueprint'), fakeBlueprintModuleDir);
          fse.writeJsonSync(path.join(fakeBlueprintModuleDir, 'package.json'), packagejs);
        })
        .withJHipsterConfig()
        .withOptions({
          skipChecks: false,
          blueprint: 'myblueprint',
        }));
  });

  describe('generate application with a peer version-compatible blueprint', () => {
    let runResult;
    before(async () => {
      runResult = await helpers
        .runJHipster(GENERATOR_APP)
        .withJHipsterConfig()
        .withFiles({
          'node_modules/generator-jhipster-myblueprint/package.json': {
            name: 'generator-jhipster-myblueprint',
            version: '9.9.9',
            type: 'module',
            peerDependencies: {
              'generator-jhipster': '^7.0.0-beta.0',
            },
          },
        })
        .inTmpDir(dir => {
          // Fake the presence of the blueprint in node_modules
          const fakeBlueprintModuleDir = path.join(dir, 'node_modules/generator-jhipster-myblueprint');
          fse.copySync(getTemplatePath('blueprints/fake-blueprint'), fakeBlueprintModuleDir);
        })
        .commitFiles()
        .withOptions({
          skipChecks: false,
          blueprint: 'myblueprint',
        });
    });

    it('creates expected default files for server and angular', () => {
      jestExpect(runResult.getStateSnapshot()).toMatchSnapshot();
    });

    it('blueprint version is saved in .yo-rc.json', () => {
      assert.JSONFileContent('.yo-rc.json', {
        'generator-jhipster': { blueprints: [{ name: 'generator-jhipster-myblueprint', version: '9.9.9' }] },
      });
    });
    it('blueprint module and version are in package.json', () => {
      assert.fileContent('package.json', /"generator-jhipster-myblueprint": "9.9.9"/);
    });
  });

  describe('generate application with a peer conflicting version blueprint', () => {
    it('throws an error', () =>
      jestExpect(() =>
        helpers
          .runJHipster(GENERATOR_APP)
          .inTmpDir(dir => {
            // Fake the presence of the blueprint in node_modules
            const packagejs = {
              name: 'generator-jhipster-myblueprint',
              version: '9.9.9',
              type: 'module',
              peerDependencies: {
                'generator-jhipster': '1.1.1',
              },
            };
            const fakeBlueprintModuleDir = path.join(dir, 'node_modules/generator-jhipster-myblueprint');
            fse.ensureDirSync(fakeBlueprintModuleDir);
            fse.copySync(getTemplatePath('blueprints/fake-blueprint'), fakeBlueprintModuleDir);
            fse.writeJsonSync(path.join(fakeBlueprintModuleDir, 'package.json'), packagejs);
          })
          .withJHipsterConfig()
          .withOptions({
            skipChecks: false,
            blueprint: 'myblueprint',
          })
      ).rejects.toThrow(/targets JHipster 1.1.1 and is not compatible with this JHipster version/));
  });
});