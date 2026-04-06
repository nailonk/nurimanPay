import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
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

  const target = Number(data.target_amount) || 0;
  const collected = Number(data.collected_amount) || 0;
  const progress = target > 0 ? Math.min(Math.round((collected / target) * 100), 100) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "null" || dateString.startsWith("0000-00-00")) {
      return "-";
    }

    try {
      const cleanDate = dateString.replace(/ /g, "T"); 
      const date = new Date(cleanDate);

      if (isNaN(date.getTime())) return "-";

      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "-";
    }
  };

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition ring-0 focus:ring-0 focus-visible:ring-0 outline-none">
      {/* IMAGE SECTION */}
      <div className="relative h-52 w-full bg-gray-100">
        <img
          src={data.image && data.image !== "null" ? data.image : IMAGE_PLACEHOLDER}
          onError={(e) => { e.target.src = IMAGE_PLACEHOLDER; }}
          alt={data.title}
          className="w-full h-full object-cover"
        />

        {data.status && (
          <span className="absolute top-3 left-3 bg-[#1b602f] text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full shadow-sm uppercase">
            {data.status}
          </span>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        {/* TITLE & ACTIONS */}
        <div className="flex justify-between items-start gap-4">
          <h1 className="font-bold text-gray-800 leading-tight line-clamp-1 flex-1">
            {data.title}
          </h1>
          <div className="flex gap-3 text-gray-400 mt-1 shrink-0">
            <Pencil
              size={17}
              onClick={() => navigate(`/admin/program/edit/${data.id}`)}
              className="cursor-pointer hover:text-orange-500 transition-colors"
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Trash2
                  size={17}
                  className="cursor-pointer hover:text-red-500 transition-colors"
                />
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl bg-white border-none">
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Program?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Program <strong>{data.title}</strong> akan dihapus permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(data.id)}
                    className="bg-red-500 hover:bg-red-600 rounded-xl"
                  >
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">
          {data.description || "Tidak ada deskripsi."}
        </p>

        {/* PROGRESS BAR */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-gray-400 uppercase tracking-tight">Progres</span>
            <span className="text-[#7FAE5A]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A3C585] rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* DONATION DETAILS */}
        <div className="flex justify-between items-end pt-1">
          <div className="space-y-0.5">
            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Terkumpul</p>
            <p className="font-bold text-gray-800 text-sm">{formatCurrency(collected)}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Target</p>
            <p className="text-gray-600 text-sm font-medium">{formatCurrency(target)}</p>
          </div>
        </div>

        {/* FOOTER: Tanggal (Kiri) & Detail (Kanan) Sejajar */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Calendar size={13} className="text-orange-400" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {formatDate(data.end_date)}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-[#7FAE5A] hover:text-[#1b602f] hover:bg-[#A3C585]/5 font-bold p-0 h-auto text-[11px] tracking-tight"
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