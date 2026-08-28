import type { ProjectKey } from './projects';

/* The `impact` strings carry one <span class="ink-strong"> each and are
   rendered with dangerouslySetInnerHTML, exactly as before. They are authored
   here, never taken from user input. */
export interface ProjectCopy {
    subtitle: string;
    impact: string;
}

export const projectsEn: Record<ProjectKey, ProjectCopy> = {
    crmsolid: {
        subtitle: 'Multi-Tenant SaaS CRM, In Production',
        impact:
            "Wrote and run a live SaaS CRM on my own. It ships as <span class='ink-strong'>5 separately deployed services</span>: REST API, admin panel, desktop agent, health monitor and landing site. A modular monolith, not microservices, with 516 NUnit tests behind it.",
    },
    neriopanel: {
        subtitle: 'Multi-Tenant SaaS Platform',
        impact:
            "Built white label hosting so resellers run branded panels on their own domains. One shared database with <span class='ink-strong'>row level security</span> per tenant, and a PowerDNS and Nginx layer that issues SSL and routes domains on its own.",
    },
    evelynn: {
        subtitle: 'Multi-Session Desktop Automation Agent',
        impact:
            "Built a multi-threaded core that runs <span class='ink-strong'>20+ sessions at once</span> on one machine with controlled memory use. Per session rate limiting and spread out request timing keep the workload inside each service's published limits.",
    },
    leadScoring: {
        subtitle: 'AI Lead Qualification',
        impact:
            "Reads incoming CRM messages, works out intent and flags the leads worth a call. Runs on the <span class='ink-strong'>Anthropic and OpenAI APIs</span>, and names no model version so it does not go stale.",
    },
    commerce: {
        subtitle: 'High-Traffic Order Processing',
        impact:
            "Ran a marketing and e-commerce stack at about <span class='ink-strong'>10,000 API calls a day</span>. Added Redis query caching and the database indexes that were missing, which cut server load by about 40%.",
    },
};
