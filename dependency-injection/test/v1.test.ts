import { describe, test } from 'node:test';
import assert from 'node:assert';

describe('V1', () => {
  test('child class should be able to populate values from parent class', () => {
    class Entity {
      constructor(public id: string) {}
    }

    type ParentRepositoryContext = {
      dbRows: Entity[];
    };

    class ParentRepository {
      constructor(protected context: ParentRepositoryContext) {}

      findOne(input: { id: string }): Entity | undefined {
        return this.context.dbRows.find((row) => row.id === input.id);
      }
    }

    type ParerentServiceContext = ParentRepositoryContext & {
      Repository: typeof ParentRepository;
    };

    class ParentService {
      repository: ParentRepository;

      constructor(protected context: ParerentServiceContext) {
        this.repository = new this.context.Repository(this.context);
      }

      findOne(input: { id: string }): Entity | undefined {
        return this.repository.findOne(input);
      }

      findOneOrFail(input: { id: string }): Entity {
        const entity = this.findOne(input);

        if (!entity) {
          throw new Error('Entity not found');
        }

        return entity;
      }
    }

    class ChildRepository extends ParentRepository {
      findAll(): Entity[] {
        return this.context.dbRows;
      }
    }

    type ChildServiceContext = Omit<ParerentServiceContext, 'Repository'> & {
      Repository: typeof ChildRepository;
    };

    class ChildService extends ParentService {
      override repository: ChildRepository;

      constructor(protected override context: ChildServiceContext) {
        super(context);

        this.repository = new this.context.Repository(this.context);
      }

      findAll(): Entity[] {
        return this.repository.findAll();
      }
    }

    const dbRows: Entity[] = [new Entity('1')];
    const childService = new ChildService({
      dbRows,
      Repository: ChildRepository,
    });

    assert.deepEqual(childService.findAll(), dbRows);
  });
});
