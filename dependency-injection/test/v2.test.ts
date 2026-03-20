import { describe, test } from 'node:test';
import assert from 'node:assert';

describe('V2', () => {
  test('child class should be able to populate values from parent class', () => {
    class Entity {
      constructor(public id: string) {}
    }

    class ParentRepository {
      static defaultContext = {
        dbRows: [] as Entity[],
      };

      protected dbRows: Entity[];

      constructor(input: Partial<typeof ParentRepository.defaultContext>) {
        const context = { ...ParentRepository.defaultContext, ...input };

        this.dbRows = context.dbRows;
      }

      findOne(input: { id: string }): Entity | undefined {
        return this.dbRows.find((row) => row.id === input.id);
      }
    }

    class ParentService {
      static defaultContext = {
        ...ParentRepository.defaultContext,
        Repository: ParentRepository,
      };

      protected repository: ParentRepository;

      constructor(input: Partial<typeof ParentService.defaultContext>) {
        const context = { ...ParentService.defaultContext, ...input };

        this.repository = new context.Repository(context);
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
        return this.dbRows;
      }
    }

    class ChildService extends ParentService {
      static override defaultContext = {
        ...ParentService.defaultContext,
        Repository: ChildRepository,
      };

      protected override repository: ChildRepository;

      constructor(input: Partial<typeof ChildService.defaultContext>) {
        super(input);
        const context = { ...ChildService.defaultContext, ...input };

        this.repository = new context.Repository(context);
      }

      findAll(): Entity[] {
        return this.repository.findAll();
      }
    }

    const dbRows: Entity[] = [new Entity('1')];
    const childService = new ChildService({ dbRows });

    assert.deepEqual(childService.findAll(), dbRows);
  });
});
