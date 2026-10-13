import records from "../data/adminContent.json";
import { site } from "../config";

/** Entries managed from /admin. Content is committed to GitHub and compiled by Astro. */
export type Visibility = "draft" | "published";
export type ProjectRecord = {
  slug:string;title:string;summary:string;category:string;stage:string;technologies:string[];
  problem:string;approach:string;results:string;next:string;link:string;
  status:Visibility;updatedAt:string
};
export type AchievementRecord = {
  slug:string;title:string;result:string;event:string;year:string;description:string;
  proofUrl:string;status:Visibility;updatedAt:string
};
export type CredentialRecord = {
  slug:string;title:string;issuer:string;credentialState:string;date:string;
  verificationUrl:string;status:Visibility;updatedAt:string
};
export type AdminContent = {projects:ProjectRecord[];achievements:AchievementRecord[];certifications:CredentialRecord[]};

export const adminContent = records as AdminContent;
export const newProjects = adminContent.projects.filter(item=>item.status==="published");
export const achievements = adminContent.achievements.filter(item=>item.status==="published");
export const credentials = adminContent.certifications.filter(item=>item.status==="published");

const base=import.meta.env.BASE_URL.endsWith("/")?import.meta.env.BASE_URL:import.meta.env.BASE_URL+"/";
export const combinedProjects=[
  ...site.projects,
  ...newProjects.map((p,i)=>({
    index:String(site.projects.length+i+1).padStart(2,"0"),
    slug:p.slug, name:p.title,type:p.category||"PERSONAL PROJECT",
    summary:p.summary, outcome:p.results.slice(0,100)||"À documenter",
    status:p.stage||"Publié",tags:p.technologies,href:"projects/"+p.slug+"/"
  }))
];
export const projectHref=(slug:string)=>base+"projects/"+slug+"/";
