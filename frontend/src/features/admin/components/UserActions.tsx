import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserActionsProps {
  onWarn: (reason: string) => void;
  onBan: (reason: string) => void;
}

export const UserActions = ({ onWarn, onBan }: UserActionsProps) => {
  const [isWarnDialogOpen, setWarnDialogOpen] = useState(false);
  const [isBanDialogOpen, setBanDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleWarn = () => {
    onWarn(reason);
    setWarnDialogOpen(false);
    setReason("");
  };

  const handleBan = () => {
    onBan(reason);
    setBanDialogOpen(false);
    setReason("");
  };

  return (
    <div>
      <DropdownMenu>
        <Button onClick={() => setWarnDialogOpen(true)} className="text-yellow-600">
          ⚠️ Warn User
        </Button>
        <Button onClick={() => setBanDialogOpen(true)} className="text-red-600">
          🚫 Ban User
        </Button>
      </DropdownMenu>

      {/* Warn Dialog */}
      <Dialog isOpen={isWarnDialogOpen} onClose={() => setWarnDialogOpen(false)}>
        <h2 className="text-lg font-semibold">Warn User</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for warning"
          className="w-full p-2 border rounded-md mt-2"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setWarnDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleWarn} className="bg-yellow-500 text-white">
            Warn
          </Button>
        </div>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog isOpen={isBanDialogOpen} onClose={() => setBanDialogOpen(false)}>
        <h2 className="text-lg font-semibold text-red-600">Ban User</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for banning"
          className="w-full p-2 border rounded-md mt-2"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setBanDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBan} className="bg-red-500 text-white">
            Ban
          </Button>
        </div>
      </Dialog>
    </div>
  );
};