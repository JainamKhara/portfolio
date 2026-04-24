import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CertificateCardProps {
  id: string;
  name: string;
  image: string;
  organization: string;
  date: string;
}

export function CertificateCard({
  id,
  name,
  image,
  organization,
  date,
}: CertificateCardProps) {
  return (
    <Link href={`/certificates/${id}`}>
      <Card className="h-full flex flex-col overflow-hidden border-2 transition-all hover:border-primary group cursor-pointer">
        {/* Image Container - Full height to show complete certificate */}
        <div className="relative w-full h-64 overflow-hidden group">
          <Image
            src={image}
            alt={name}
            className="object-contain w-full h-full bg-muted group-hover:scale-105 transition-transform duration-500"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>

        {/* Content */}
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <CardDescription>{organization}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-end">
          <p className="text-sm text-muted-foreground">{date}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
