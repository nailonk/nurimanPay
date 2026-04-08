import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar, Loader2 } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const IMAGE_PLACEHOLDER = "https://placehold.co/600x400/f3f4f6/a3c585?text=No+Image";

function ProgramCard({ data, onDelete }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const target = Number(data.target_amount) || 0;
  const collected = Number(data.collected_amount) || 0;
  const progress = target > 0 ? Math.min(Math.round((collected / target) * 100), 100) : 0;

  const confirmDelete = async () => {
    if (!data.id) return;
    setIsDeleting(true);
    try {
      await onDelete(data.id);
    } catch (error) {
      console.error(error);
      setIsDeleting(false); 
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "null") return "-";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "-" : date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "-";
    }
  };

  return (
    <Card className="min-w-[280px] max-w-[410px] h-fit rounded-2xl border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden ring-0 focus:ring-0 outline-none p-0 !p-0 bg-white mb-2">
      
      {isDeleting && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] transition-all">
          <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-2" />
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Menghapus...</p>
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="relative h-40 w-full bg-gray-100 shrink-0 overflow-hidden">
        <img
          src={data.image && data.image !== "null" ? data.image : IMAGE_PLACEHOLDER}
          onError={(e) => { e.target.src = IMAGE_PLACEHOLDER; }}
          loading="lazy"
          alt={data.title}
          className={`w-full h-full object-cover block transition-transform duration-500 ${isDeleting ? 'grayscale scale-105' : 'group-hover:scale-105'}`}
        />

        {data.status && (
          <span className={`absolute top-3 left-3 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full shadow-sm uppercase z-10 ${
            data.status.toLowerCase() === 'aktif' ? 'bg-[#1b602f]' : 'bg-orange-500'
          }`}>
            {data.status}
          </span>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        {/* HEADER & ACTIONS */}
        <div className="flex justify-between items-start gap-4">
          <h1 className="font-bold text-gray-800 leading-tight line-clamp-1 flex-1 text-lg">
            {data.title || "Tanpa Judul"}
          </h1>
          <div className="flex gap-1 text-gray-400 mt-1 shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors" 
              onClick={() => navigate(`/admin/program/edit/${data.id}`)}
              disabled={isDeleting}
            >
              <Pencil size={16} />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  disabled={isDeleting}
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2rem] bg-white shadow-lg">
                <AlertDialogHeader className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="h-8 w-8 text-red-500" />
                  </div>
                  <AlertDialogTitle className="text-xl font-bold text-gray-800">
                    Hapus Program?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500 mt-2">
                    Tindakan ini tidak dapat dibatalkan. Program <strong>{data.title}</strong> beserta seluruh data transaksinya akan dihapus selamanya.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 sm:justify-center gap-3">
                  <AlertDialogCancel className="rounded-xl px-6 border-gray-200 hover:bg-gray-50 font-semibold">
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmDelete}
                    className="bg-red-500 hover:bg-red-600 rounded-xl px-6 font-semibold text-white transition-all shadow-lg shadow-red-100"
                  >
                    Ya, Hapus Permanen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] leading-relaxed">
          {data.description || "Tidak ada deskripsi program."}
        </p>

        {/* PROGRESS BAR */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className="text-gray-400">Progres Donasi</span>
            <span className="text-[#7FAE5A]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A3C585] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* AMOUNT INFO */}
        <div className="flex justify-between items-end pt-1">
          <div className="space-y-0.5">
            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-widest">Terkumpul</p>
            <p className="font-bold text-gray-800 text-sm">{formatCurrency(collected)}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-widest">Target</p>
            <p className="text-gray-600 text-sm font-medium">{formatCurrency(target)}</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Calendar size={13} className="text-orange-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {formatDate(data.end_date)}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-[#7FAE5A] hover:text-[#1b602f] hover:bg-[#A3C585]/10 font-bold p-0 h-auto text-[11px] tracking-widest transition-all"
            onClick={() => navigate(`/admin/program/detail/${data.id}`)}
          >
            DETAIL PROGRAM →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProgramCard;