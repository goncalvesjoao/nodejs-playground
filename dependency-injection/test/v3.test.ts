import { describe, test } from 'node:test';
import assert from 'node:assert';

describe('V3', () => {
  test('child class should be able to populate values from parent class', () => {
    class Project {
      constructor(
        public id: string,
        public owner: string,
      ) {}
    }

    class ProjectsRepository {
      static get defaultInput() {
        return { projectDbRows: new Array<Project>() };
      }

      protected projectDbRows: Project[];

      constructor(context?: Partial<typeof ProjectsRepository.defaultInput>) {
        const data = { ...ProjectsRepository.defaultInput, ...(context || {}) };

        this.projectDbRows = JSON.parse(
          JSON.stringify(data.projectDbRows),
        ) as Project[];
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

    class ProjectsService {
      static defaultInput = {
        ...ProjectsRepository.defaultInput,
        ProjectsRepository: ProjectsRepository,
      };

      protected projectsRepository: ProjectsRepository;

      constructor(context?: Partial<typeof ProjectsService.defaultInput>) {
        const data = { ...ProjectsService.defaultInput, ...(context || {}) };

        this.projectsRepository = new data.ProjectsRepository(data);
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

    class PagesRepository {
      static get defaultInput(): { pageDbRows: Page[] } {
        return { pageDbRows: new Array<Page>() };
      }

      protected pageDbRows: Page[];

      constructor(context?: Partial<typeof PagesRepository.defaultInput>) {
        const data = { ...PagesRepository.defaultInput, ...(context || {}) };

        this.pageDbRows = JSON.parse(JSON.stringify(data.pageDbRows)) as Page[];
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

    class PagesService {
      static defaultInput = {
        ...PagesRepository.defaultInput,
        PagesRepository: PagesRepository,
      };

      protected pagesRepository: PagesRepository;

      constructor(context?: Partial<typeof PagesService.defaultInput>) {
        const data = { ...PagesService.defaultInput, ...(context || {}) };

        this.pagesRepository = new data.PagesRepository(data);
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

    class PagesDeployService extends PagesService {
      static override defaultInput = {
        ...PagesService.defaultInput,
        PagesRepository: PagesDeployRepository,
      };

      protected override pagesRepository: PagesDeployRepository;

      constructor(context?: Partial<typeof PagesDeployService.defaultInput>) {
        super(context);
        const data = { ...PagesDeployService.defaultInput, ...(context || {}) };

        this.pagesRepository = new data.PagesRepository(data);
      }

      deployAll(input: Partial<Page>): PageDeployment[] {
        const pages = this.findAll(input);

        return pages.map((page) => this.deploy(page)).flat();
      }

      deploy(page: Page): PageDeployment {
        return new PageDeployment(page, 'deployed');
      }
    }

    class ProjectsDeployService extends ProjectsService {
      static override defaultInput = {
        ...ProjectsService.defaultInput,
        ...PagesDeployService.defaultInput,
        PagesDeployService: PagesDeployService,
      };

      protected pagesDeployService: PagesDeployService;

      constructor(
        context?: Partial<typeof ProjectsDeployService.defaultInput>,
      ) {
        super(context);
        const data = {
          ...ProjectsDeployService.defaultInput,
          ...(context || {}),
        };

        this.projectsRepository = new data.ProjectsRepository(data);
        this.pagesDeployService = new data.PagesDeployService(data);
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

    // const newProjectDbRows: Project[] = [];
    // const projectService1 = new ProjectsService({
    //   projectDbRows: newProjectDbRows,
    // });
    // const projectService2 = new ProjectsDeployService({
    //   projectDbRows: newProjectDbRows,
    // });

    // const project1 = projectService1.create({ owner: 'owner-1' });
    // const project2 = projectService2.create({ owner: 'owner-2' });

    // expect(projectService1.findAll({})).toEqual([project1, project2]);
    // expect(projectService2.findAll({})).toEqual([project1, project2]);
  });
});
