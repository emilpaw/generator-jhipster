/**
 * Copyright 2013-2022 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { expect } = require('chai');
const RelationshipIssue = require('../../../../jdl/linters/issues/relationship-issue');

describe('RelationshipIssue', () => {
  describe('new', () => {
    context('when not passing any arg', () => {
      it('should fail', () => {
        expect(() => new RelationshipIssue()).to.throw(/^An issue must at least have a rule name\.$/);
      });
    });
    context('when not passing a rule name', () => {
      it('should fail', () => {
        expect(() => new RelationshipIssue({})).to.throw(/^An issue must at least have a rule name\.$/);
      });
    });
    context('when not passing a source', () => {
      it('should fail', () => {
        expect(() => new RelationshipIssue({ ruleName: 'Toto', to: 'to', type: 'type' })).to.throw(
          /^A relationship's source, destination & type must be passed\.$/
        );
      });
    });
    context('when not passing a destination', () => {
      it('should fail', () => {
        expect(() => new RelationshipIssue({ ruleName: 'Toto', source: 'source', type: 'type' })).to.throw(
          /^A relationship's source, destination & type must be passed\.$/
        );
      });
    });
  });
  context('when not passing a type', () => {
    it('should fail', () => {
      expect(() => new RelationshipIssue({ ruleName: 'Toto', source: 'source', to: 'to' })).to.throw(
        /^A relationship's source, destination & type must be passed\.$/
      );
    });
  });
});