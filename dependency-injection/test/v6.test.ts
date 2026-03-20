import { describe, test } from 'node:test';
import assert from 'node:assert';

describe('V6', () => {
  test('child class should be able to populate values from parent class', () => {
    class Project {
      constructor(
        public id: string,
        public owner: string,
      ) {}
    }

    type ProjectsRepositoryContextType = {
      projectDbRows?: Project[];
    };

    class ProjectsRepository {
      protected projectDbRows: Project[];

      constructor(context?: ProjectsRepositoryContextType) {
        this.projectDbRows = context?.projectDbRows || [];
      }

      create(input: Partial<Project>): Project {
        const project = new Project(
          String(this.projectDbRows.length + 1),
          input.owner || 'default-owner',
        );

        this.projectDbRows.push(project);

        return project;
      }

      findAll(input: Partial<Project>): Project[] {
        const projects = this.projectDbRows.filter((page) => {
          return Object.keys(input).every((key) => {
            const value = input[key as keyof typeof input];

            return page[key as keyof Project] === value;
          });
        });

        return projects;
      }

      findOne(input: Partial<Project> & { id: string }): Project | undefined {
        return this.findAll(input)[0];
      }
    }

    type ProjectsServiceContextType = ProjectsRepositoryContextType & {
      ProjectsRepository?: typeof ProjectsRepository;
    };

    class ProjectsService {
      protected projectsRepository: ProjectsRepository;

      constructor(context?: ProjectsServiceContextType) {
        this.projectsRepository = new (
          context?.ProjectsRepository || ProjectsRepository
        )(context);
      }

      create(input: Partial<Project>): Project {
        return this.projectsRepository.create(input);
      }

      findAll(input: Partial<Project>): Project[] {
        return this.projectsRepository.findAll(input);
      }

      findOne(input: Partial<Project> & { id: string }): Project | undefined {
        return this.projectsRepository.findOne(input);
      }
    }

    class Page {
      constructor(
        public id: string,
        public name: string,
        public projectId: string,
      ) {}
    }

    class PageDeployment {
      constructor(
        public page: Page,
        public status: string,
      ) {}
    }

    type PagesRepositoryContextType = {
      pageDbRows?: Page[];
    };

    class PagesRepository {
      protected pageDbRows: Page[];

      constructor(context?: PagesRepositoryContextType) {
        this.pageDbRows = context?.pageDbRows || [];
      }

      findAll(input: Partial<Page>): Page[] {
        const pages = this.pageDbRows.filter((page) => {
          return Object.keys(input).every((key) => {
            const value = input[key as keyof typeof input];

            return page[key as keyof Page] === value;
          });
        });

        return pages;
      }

      findOne(input: Partial<Page> & { id: string }): Page | undefined {
        return this.findAll(input)[0];
      }
    }

    type PagesServiceContextType = PagesRepositoryContextType & {
      PagesRepository?: typeof PagesRepository;
    };

    class PagesService {
      protected pagesRepository: PagesRepository;

      constructor(context?: PagesServiceContextType) {
        this.pagesRepository = new (
          context?.PagesRepository || PagesRepository
        )(context);
      }

      findAll(input: Partial<Page>): Page[] {
        return this.pagesRepository.findAll(input);
      }

      findOne(input: Partial<Page> & { id: string }): Page | undefined {
        return this.pagesRepository.findOne(input);
      }
    }

    class PagesDeployRepository extends PagesRepository {
      override findAll(input: Partial<Page>): Page[] {
        const pages = super.findAll(input);

        if (pages.length === 0) {
          throw new Error('No pages found to deploy');
        }

        return pages;
      }
    }

    type PagesDeployServiceContextType = PagesServiceContextType & {
      PagesDeployRepository?: typeof PagesDeployRepository;
    };

    class PagesDeployService extends PagesService {
      protected override pagesRepository: PagesDeployRepository;

      constructor(context?: PagesDeployServiceContextType) {
        super(context);

        this.pagesRepository = new (
          context?.PagesDeployRepository || PagesDeployRepository
        )(context);
      }

      deployAll(input: Partial<Page>): PageDeployment[] {
        const pages = this.findAll(input);

        return pages.map((page) => this.deploy(page)).flat();
      }

      deploy(page: Page): PageDeployment {
        return new PageDeployment(page, 'deployed');
      }
    }

    type ProjectsDeployServiceContextType = ProjectsServiceContextType &
      PagesDeployServiceContextType & {
        PagesDeployService?: typeof PagesDeployService;
      };

    class ProjectsDeployService extends ProjectsService {
      protected pagesDeployService: PagesDeployService;

      constructor(context?: ProjectsDeployServiceContextType) {
        super(context);

        this.projectsRepository = new (
          context?.ProjectsRepository || ProjectsRepository
        )(context);
        this.pagesDeployService = new (
          context?.PagesDeployService || PagesDeployService
        )(context);
      }

      deployAll(input: Partial<Project>): PageDeployment[] {
        const projects = this.findAll(input);

        return projects.map((project) => this.deploy(project)).flat();
      }

      deploy(project: Project): PageDeployment[] {
        return this.pagesDeployService.deployAll({
          projectId: project.id,
        });
      }
    }

    const projectDbRows: Project[] = [
      new Project('1', 'owner-1'),
      new Project('2', 'owner-1'),
      new Project('3', 'owner-3'),
    ];
    const pageDbRows: Page[] = [
      new Page('1', 'home', '1'),
      new Page('2', 'about-us', '2'),
      new Page('3', 'contact-us', '3'),
    ];

    const projectsDeployService = new ProjectsDeployService({
      projectDbRows,
      pageDbRows,
    });

    const expectedDeployments = [
      new PageDeployment(pageDbRows[0]!, 'deployed'),
      new PageDeployment(pageDbRows[1]!, 'deployed'),
    ];

    assert.deepEqual(projectsDeployService.deployAll({ owner: 'owner-1' }), expectedDeployments);

    const newProjectsDeployService = new ProjectsDeployService();

    const project = newProjectsDeployService.create({ owner: 'owner-1' });

    assert.deepEqual(newProjectsDeployService.findAll({}), [project]);

    assert.deepEqual(new ProjectsDeployService().findAll({}), []);

    const newProjectDbRows: Project[] = [];
    const projectService1 = new ProjectsService({
      projectDbRows: newProjectDbRows,
    });
    const projectService2 = new ProjectsDeployService({
      projectDbRows: newProjectDbRows,
    });

    const project1 = projectService1.create({ owner: 'owner-1' });
    const project2 = projectService2.create({ owner: 'owner-2' });

    assert.deepEqual(projectService1.findAll({}), [project1, project2]);
    assert.deepEqual(projectService2.findAll({}), [project1, project2]);
  });
});
