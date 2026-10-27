import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, FileCheck2, ExternalLink, Clock3 } from 'lucide-react';
import iitPatnaLogo from '@/assets/iit-patna-logo.png';
import lnctLogo from '@/assets/lnct-logo.png';
import bsebLogo from '@/assets/bseb-logo.png';

export interface EducationDocument {
  title: string;
  organization: string;
  enrollment_number?: string | null;
  academic_session?: string | null;
  certificate_url?: string | null;
}

export const officialDocumentUrl = (value?: string | null) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

const getInstitutionLogo = (organization?: string | null) => {
  const name = (organization || '').toLowerCase();
  if (/institute of technology patna|iit patna|iit-?p\b/.test(name)) return iitPatnaLogo;
  if (/lnct|lakshmi narain/.test(name)) return lnctLogo;
  if (/bseb|bihar school/.test(name)) return bsebLogo;
  return null;
};

export default function EducationDocumentModal({ document, mode, onClose }: {
  document: EducationDocument | null;
  mode: 'record' | 'certificate';
  onClose: () => void;
}) {
  const url = officialDocumentUrl(document?.certificate_url);
  return (
    <Dialog open={Boolean(document)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 bg-background">
        <div className="border-4 border-double border-primary/40 p-4 sm:p-6 rounded-lg">
          <div className="text-center border-b border-border pb-5">
            <GraduationCap className="size-10 text-primary mx-auto mb-3" />
            <p className="text-xs text-muted-foreground uppercase mb-2">{mode === 'certificate' ? 'Education certificate' : 'Academic record · Portfolio'}</p>
            <DialogTitle className="text-xl sm:text-2xl leading-snug">{document?.organization}</DialogTitle>
            <DialogDescription className="mt-2 text-base">{document?.title}</DialogDescription>
          </div>
          {mode === 'record' ? (
            <>
              <dl className="grid sm:grid-cols-2 gap-5 py-6 text-sm">
                <div><dt className="text-muted-foreground">Session</dt><dd className="font-semibold mt-1">{document?.academic_session || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Roll number</dt><dd className="font-semibold mt-1 break-all">{document?.enrollment_number || '—'}</dd></div>
              </dl>
              <div className="border-y border-border py-8 text-center">
                <Clock3 className="size-8 text-primary mx-auto mb-3" />
                <Badge variant="secondary">Examinations pending</Badge>
                <p className="mt-3 font-medium">No semester results available</p>
                <p className="text-sm text-muted-foreground mt-2">Marks, SGPA and CGPA: Not available</p>
              </div>
              <p className="mt-4 text-xs text-muted-foreground text-center">Portfolio academic record — not an institution-issued marksheet.</p>
            </>
          ) : url ? (
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><FileCheck2 className="size-4" />Uploaded certificate</div>
              {/\.(png|jpe?g|webp)(\?|$)/i.test(url) ? (
                <img src={url} alt={`${document?.organization} certificate`} className="w-full h-auto border border-border rounded" />
              ) : (
                <iframe title="Official education certificate" src={url} className="w-full h-[50vh] border border-border rounded" />
              )}
              <Button asChild variant="outline" className="w-full"><a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4 mr-2" />Open original certificate</a></Button>
            </div>
          ) : (
            <p className="py-10 text-center text-muted-foreground">Official certificate not uploaded yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}