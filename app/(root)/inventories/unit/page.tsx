import { UnitColumn } from "@/columns/UnitColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { UNIT_EMPTY } from "@/constants/states";
import { getUnits } from "@/lib/actions/unit.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CiCirclePlus } from "react-icons/ci";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Unit = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getUnits({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { units, totalCount, isNext } = data || {};
  return (
    <CardContainer
      title="UNIT"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDUNIT}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <LocalSearch route={ROUTES.UNITS} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={units}
          empty={UNIT_EMPTY}
          render={() => (
            <DataTable
              columns={UnitColumn}
              data={units!}
              totalCount={totalCount}
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};
export default Unit;
