import {  FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";

export default function Footer() {
   return (
    <div className="container h-20 p-4 bg-black/5">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center">
         <h1>© 2024 Market Cloths, Inc. All rights reserved.</h1>
         <div className="flex md:flex-row gap-2 space-x-2">
            <FacebookIcon/>
            <InstagramIcon/>
            <LinkedinIcon/>
            <GithubIcon/>
            <YoutubeIcon/>
         </div>
      </div>

    </div>
   )
}
