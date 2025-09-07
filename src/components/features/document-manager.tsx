"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileText, Trash2, Loader2, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { invokeAnalyzeDocument } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Document {
  file: File;
  name: string;
  date: string;
  status: "New" | "Analyzing" | "Analyzed" | "Error";
  summary?: string;
}

interface StoredDocument {
    name: string;
    date: string;
    status: "New" | "Analyzing" | "Analyzed" | "Error";
    summary?: string;
    dataUri: string;
}

// Function to convert Data URI to File object
const dataURIToFile = (dataURI: string, fileName: string): File => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], fileName, { type: mimeString });
};


export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem("managedDocuments");
      if (storedDocs) {
        const parsedDocs: StoredDocument[] = JSON.parse(storedDocs);
        const fileDocs = parsedDocs.map(doc => ({
            ...doc,
            file: dataURIToFile(doc.dataUri, doc.name)
        }));
        setDocuments(fileDocs);
      }
    } catch (error) {
        console.error("Failed to parse documents from localStorage", error);
        localStorage.removeItem("managedDocuments");
    }
  }, []);

  const updateLocalStorage = (docs: Document[]) => {
    const readerPromises = docs.map(doc => {
        return new Promise<StoredDocument>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(doc.file);
            reader.onload = () => {
                resolve({
                    name: doc.name,
                    date: doc.date,
                    status: doc.status,
                    summary: doc.summary,
                    dataUri: reader.result as string,
                });
            };
            reader.onerror = error => reject(error);
        });
    });
    
    Promise.all(readerPromises)
        .then(storableDocs => {
            localStorage.setItem("managedDocuments", JSON.stringify(storableDocs));
        })
        .catch(error => {
            console.error("Error converting files for localStorage", error);
            toast({
                variant: 'destructive',
                title: "Storage Error",
                description: "Could not save documents for persistence."
            });
        });
  };

  const handleSetDocuments = (newDocuments: Document[] | ((prev: Document[]) => Document[])) => {
    const updatedDocs = typeof newDocuments === 'function' ? newDocuments(documents) : newDocuments;
    setDocuments(updatedDocs);
    updateLocalStorage(updatedDocs);
  };


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments: Document[] = Array.from(files).map(file => ({
        file,
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        status: "New",
      }));
      handleSetDocuments(prev => [...prev, ...newDocuments]);
      toast({
        title: "Upload Successful",
        description: `${files.length} document(s) have been added.`,
      });
    }
  };
  
  const handleDelete = (docNameToDelete: string) => {
    handleSetDocuments(docs => docs.filter(doc => doc.name !== docNameToDelete));
    toast({
      title: "Document Deleted",
      description: `"${docNameToDelete}" has been removed.`,
    });
  };

  const handleView = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  const handleAnalyze = async (docName: string) => {
    const doc = documents.find(d => d.name === docName);
    if (!doc) return;

    handleSetDocuments(docs => docs.map(d => d.name === docName ? { ...d, status: 'Analyzing' } : d));

    const reader = new FileReader();
    reader.readAsDataURL(doc.file);
    reader.onload = async () => {
      const documentDataUri = reader.result as string;
      const response = await invokeAnalyzeDocument({ documentDataUri });

      if (response.success && response.data) {
        handleSetDocuments(docs => docs.map(d => d.name === docName ? { ...d, status: 'Analyzed', summary: response.data!.summary } : d));
        toast({
          title: "Analysis Complete",
          description: `"${docName}" has been analyzed.`,
        });
      } else {
        handleSetDocuments(docs => docs.map(d => d.name === docName ? { ...d, status: 'Error' } : d));
        toast({
          variant: 'destructive',
          title: "Analysis Failed",
          description: response.error || 'An unexpected error occurred.',
        });
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      handleSetDocuments(docs => docs.map(d => d.name === docName ? { ...d, status: 'Error' } : d));
      toast({
        variant: 'destructive',
        title: "File Read Error",
        description: "Could not read the document for analysis.",
      });
    }
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Upload relevant legal documents for analysis. All files are handled securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT (MAX. 25MB)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileUpload} />
            </label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Managed Documents</CardTitle>
          <CardDescription>
            View, analyze, and manage all uploaded documents for this case.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Date Uploaded</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{doc.date}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={
                        doc.status === 'Analyzed' ? 'default' 
                        : doc.status === 'Analyzing' ? 'secondary'
                        : doc.status === 'Error' ? 'destructive'
                        : 'outline'
                      } className={doc.status === 'Analyzed' ? 'bg-green-600/20 text-green-800 border-transparent' : ''}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {doc.summary && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto">View Summary</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Analysis Summary</DialogTitle>
                              <DialogDescription>
                                AI-generated summary for "{doc.name}".
                              </DialogDescription>
                            </DialogHeader>
                            <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto">
                                <p>{doc.summary}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" onClick={() => handleAnalyze(doc.name)} disabled={doc.status === 'Analyzing'}>
                          {doc.status === 'Analyzing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                          Analyze
                       </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleView(doc.file)}>
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(doc.name)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No documents uploaded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
